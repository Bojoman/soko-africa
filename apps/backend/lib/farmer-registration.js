/**
 * Orchard-producer sourcing records.
 * A registration does not create a seller role, a payout account, or a payment.
 * Crop, variety, and village are free text. Targets are reported, never enforced.
 */

const OWNERSHIP = new Set(['INDEPENDENT', 'COMPANY']);
const STATUSES = new Set(['SUBMITTED', 'REVIEWED']);
const MIN_YEAR = 1900;

export function maskNationalId(value) {
  const compact = String(value ?? '').replace(/\s+/g, '');
  if (!compact) return '';
  if (compact.length <= 4) return '•'.repeat(compact.length);
  return `${'•'.repeat(compact.length - 4)}${compact.slice(-4)}`;
}

export function calendarDateInZone(now = new Date(), timeZone = 'Africa/Nairobi') {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(now);
}

function norm(value) {
  return String(value ?? '').trim().toLowerCase();
}

function collapseName(value) {
  return String(value ?? '').trim().replace(/\s+/g, ' ');
}

function push(details, field, message) {
  details.push({ field, message });
}

function readNumber(value) {
  if (value === undefined || value === null || value === '') return { absent: true };
  if (typeof value === 'boolean') return { invalid: true };
  const n = typeof value === 'number' ? value : Number(String(value).trim());
  if (!Number.isFinite(n)) return { invalid: true };
  return { value: n };
}

function optionalText(value, max) {
  if (value === undefined || value === null) return null;
  const text = String(value).trim();
  if (!text) return null;
  if (text.length > max) return { tooLong: true };
  return text;
}

function dateOnlyUtc(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function validCalendarDate(isoDate) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return false;
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = dateOnlyUtc(isoDate);
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

/**
 * @returns {{ ok: true, value: object } | { ok: false, details: { field: string, message: string }[] }}
 */
export function validateRegistration(body, now = new Date()) {
  const details = [];
  const source = body && typeof body === 'object' ? body : {};
  const fullName = collapseName(source.fullName);
  if (fullName.length < 2 || fullName.length > 120) {
    push(details, 'fullName', 'Enter the farmer or company name (2–120 characters).');
  }

  const nationalId = String(source.nationalIdNumber ?? '').trim();
  const nationalIdCompact = nationalId.replace(/[\s-]/g, '');
  if (!/^[A-Za-z0-9]{5,20}$/.test(nationalIdCompact)) {
    push(details, 'nationalIdNumber', 'Enter an ID number using 5–20 letters or digits.');
  }

  const phone = collapseName(source.phone);
  const phoneDigits = phone.replace(/\D/g, '');
  if (phoneDigits.length < 7 || phoneDigits.length > 15 || !/^[+0-9][0-9\s().-]{6,24}$/.test(phone)) {
    push(details, 'phone', 'Enter a phone number with at least 7 digits.');
  }

  const village = collapseName(source.village);
  if (village.length < 1 || village.length > 80) {
    push(details, 'village', 'Enter a village. It does not have to be on the suggestion list.');
  }

  const ownership = String(source.ownership || '').trim().toUpperCase();
  if (!OWNERSHIP.has(ownership)) {
    push(details, 'ownership', 'Choose independent farmer or company orchard.');
  }

  const notesResult = optionalText(source.notes, 2000);
  if (notesResult && notesResult.tooLong) {
    push(details, 'notes', 'Notes must be 2000 characters or fewer.');
  }

  if (source.accepted !== true) {
    push(details, 'accepted', 'Confirm the registration with the checkbox. No payment is taken.');
  }

  const acceptedFullName = collapseName(source.acceptedFullName);
  if (!acceptedFullName) {
    push(details, 'acceptedFullName', 'Type your full name to accept the form.');
  } else if (fullName && acceptedFullName.toLowerCase() !== fullName.toLowerCase()) {
    push(details, 'acceptedFullName', 'The typed name must match the farmer or company name.');
  }

  const orchards = Array.isArray(source.orchards) ? source.orchards : null;
  if (!orchards || orchards.length === 0) {
    push(details, 'orchards', 'Add at least one orchard.');
  }

  const cleanOrchards = [];
  const today = calendarDateInZone(now);
  const maxYear = Number(today.slice(0, 4)) + 1;

  (orchards || []).forEach((orchard, index) => {
    const prefix = `orchards.${index}`;
    const row = orchard && typeof orchard === 'object' ? orchard : {};
    const name = collapseName(row.name);
    if (name.length < 1 || name.length > 120) {
      push(details, `${prefix}.name`, 'Enter an orchard name.');
    }

    const lat = readNumber(row.latitude);
    const lng = readNumber(row.longitude);
    let latitude = null;
    let longitude = null;
    if (lat.invalid) push(details, `${prefix}.latitude`, 'Latitude must be a number from -90 to 90.');
    if (lng.invalid) push(details, `${prefix}.longitude`, 'Longitude must be a number from -180 to 180.');
    if (!lat.absent && !lat.invalid && (lat.value < -90 || lat.value > 90)) {
      push(details, `${prefix}.latitude`, 'Latitude must be a number from -90 to 90.');
    } else if (!lat.absent && !lat.invalid) {
      latitude = lat.value;
    }
    if (!lng.absent && !lng.invalid && (lng.value < -180 || lng.value > 180)) {
      push(details, `${prefix}.longitude`, 'Longitude must be a number from -180 to 180.');
    } else if (!lng.absent && !lng.invalid) {
      longitude = lng.value;
    }
    if ((latitude == null) !== (longitude == null)) {
      push(details, `${prefix}.latitude`, 'Enter both latitude and longitude, or leave both blank.');
    }

    const pin = optionalText(row.pinDescription, 300);
    if (pin && pin.tooLong) {
      push(details, `${prefix}.pinDescription`, 'The pin description must be 300 characters or fewer.');
    }

    const acreage = readNumber(row.acreage);
    if (acreage.absent || acreage.invalid || acreage.value < 0) {
      push(details, `${prefix}.acreage`, 'Acreage must be a number that is zero or greater.');
    }

    const trees = readNumber(row.treeCount);
    if (trees.absent || trees.invalid || trees.value < 0 || !Number.isInteger(trees.value)) {
      push(details, `${prefix}.treeCount`, 'Number of trees must be a whole number that is zero or greater.');
    }

    const orchardNotes = optionalText(row.notes, 2000);
    if (orchardNotes && orchardNotes.tooLong) {
      push(details, `${prefix}.notes`, 'Orchard notes must be 2000 characters or fewer.');
    }

    const crops = Array.isArray(row.crops) ? row.crops : null;
    if (!crops || crops.length === 0) {
      push(details, `${prefix}.crops`, 'Add at least one crop for this orchard.');
    }

    const cleanCrops = [];
    (crops || []).forEach((cropRow, cropIndex) => {
      const cropPrefix = `${prefix}.crops.${cropIndex}`;
      const cropSource = cropRow && typeof cropRow === 'object' ? cropRow : {};
      const crop = collapseName(cropSource.crop);
      if (crop.length < 1 || crop.length > 80) {
        push(details, `${cropPrefix}.crop`, 'Enter a crop. It does not have to be avocado or macadamia.');
      }
      const variety = optionalText(cropSource.variety, 80);
      if (variety && variety.tooLong) {
        push(details, `${cropPrefix}.variety`, 'Variety must be 80 characters or fewer.');
      }

      const year = readNumber(cropSource.yearPlanted);
      if (year.absent || year.invalid || !Number.isInteger(year.value) || year.value < MIN_YEAR || year.value > maxYear) {
        push(
          details,
          `${cropPrefix}.yearPlanted`,
          `Year planted must be a year from ${MIN_YEAR} to ${maxYear}.`
        );
      }

      let lastSprayDate = null;
      const sprayRaw = cropSource.lastSprayDate;
      if (sprayRaw !== undefined && sprayRaw !== null && String(sprayRaw).trim() !== '') {
        const spray = String(sprayRaw).trim().slice(0, 10);
        if (!validCalendarDate(spray)) {
          push(details, `${cropPrefix}.lastSprayDate`, 'Last spray date must be a real YYYY-MM-DD date.');
        } else if (spray > today) {
          push(details, `${cropPrefix}.lastSprayDate`, 'Last spray date cannot be in the future.');
        } else {
          lastSprayDate = dateOnlyUtc(spray);
        }
      }

      const kg = readNumber(cropSource.estimatedKgPerSeason);
      if (kg.absent || kg.invalid || kg.value < 0) {
        push(details, `${cropPrefix}.estimatedKgPerSeason`, 'Estimated kg per season must be a number that is zero or greater.');
      }

      cleanCrops.push({
        crop,
        variety: variety && !variety.tooLong ? variety : null,
        yearPlanted: year.value,
        lastSprayDate,
        estimatedKgPerSeason: kg.absent || kg.invalid ? null : kg.value
      });
    });

    cleanOrchards.push({
      name,
      latitude,
      longitude,
      pinDescription: pin && !pin.tooLong ? pin : null,
      acreage: acreage.absent || acreage.invalid ? null : acreage.value,
      treeCount: trees.absent || trees.invalid ? null : trees.value,
      notes: orchardNotes && !orchardNotes.tooLong ? orchardNotes : null,
      crops: cleanCrops
    });
  });

  if (details.length) return { ok: false, details };

  return {
    ok: true,
    value: {
      fullName,
      nationalIdNumber: nationalIdCompact,
      phone,
      village,
      ownership,
      notes: notesResult && !notesResult.tooLong ? notesResult : null,
      acceptedFullName,
      orchards: cleanOrchards
    }
  };
}

export function validateStatus(status) {
  const value = String(status || '').trim().toUpperCase();
  if (!STATUSES.has(value)) {
    return {
      ok: false,
      details: [{ field: 'status', message: 'Status must be SUBMITTED or REVIEWED.' }]
    };
  }
  return { ok: true, value };
}

function asNumber(value) {
  if (value == null || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function asIso(value) {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  return value;
}

function asDateOnly(value) {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

function publicCrop(crop) {
  return {
    id: crop.id,
    crop: crop.crop,
    variety: crop.variety || null,
    yearPlanted: crop.yearPlanted ?? null,
    lastSprayDate: asDateOnly(crop.lastSprayDate),
    estimatedKgPerSeason: asNumber(crop.estimatedKgPerSeason)
  };
}

function publicOrchard(orchard) {
  return {
    id: orchard.id,
    name: orchard.name,
    latitude: asNumber(orchard.latitude),
    longitude: asNumber(orchard.longitude),
    pinDescription: orchard.pinDescription || null,
    acreage: asNumber(orchard.acreage),
    treeCount: orchard.treeCount ?? null,
    notes: orchard.notes || null,
    crops: (orchard.crops || []).map(publicCrop),
    createdAt: asIso(orchard.createdAt)
  };
}

export function toPublicRegistration(row, { includeFullId = false } = {}) {
  const registration = {
    id: row.id,
    fullName: row.fullName,
    nationalIdMasked: maskNationalId(row.nationalIdNumber),
    phone: row.phone,
    village: row.village,
    ownership: row.ownership,
    status: row.status,
    notes: row.notes || null,
    acceptedFullName: row.acceptedFullName,
    acceptedAt: asIso(row.acceptedAt),
    reviewedAt: asIso(row.reviewedAt),
    sellerProfileId: row.sellerProfileId || null,
    orchards: (row.orchards || []).map(publicOrchard),
    createdAt: asIso(row.createdAt),
    updatedAt: asIso(row.updatedAt)
  };
  if (includeFullId) registration.nationalIdNumber = row.nationalIdNumber;
  return registration;
}

export function toFarmerListItem(row) {
  const crops = [];
  for (const orchard of row.orchards || []) {
    for (const line of orchard.crops || []) {
      if (line.crop && !crops.includes(line.crop)) crops.push(line.crop);
    }
  }
  return {
    id: row.id,
    fullName: row.fullName,
    nationalIdMasked: maskNationalId(row.nationalIdNumber),
    phone: row.phone,
    village: row.village,
    ownership: row.ownership,
    status: row.status,
    orchardCount: (row.orchards || []).length,
    crops,
    createdAt: asIso(row.createdAt)
  };
}

export function confirmationCopy({ fullName, orchards, created }) {
  const parts = (orchards || []).map((orchard) => {
    const crops = (orchard.crops || [])
      .map((crop) => (crop.variety ? `${crop.crop} (${crop.variety})` : crop.crop))
      .filter(Boolean)
      .join(', ');
    return `${orchard.name} — ${crops}`;
  });
  const saved = parts.join('; ');
  return {
    headline: created
      ? `Registration received for ${fullName}.`
      : `Added to the registration for ${fullName}.`,
    detail: saved ? `Saved ${saved}.` : 'Saved the orchard record.',
    payment: 'No payment was taken.'
  };
}

export function isAdminRole(role) {
  return String(role || '').toUpperCase() === 'ADMIN';
}

export function buildFarmerReport(registrations, targets, now = new Date()) {
  const byCrop = new Map();
  const byVillage = new Map();
  const farmersByOwnership = { INDEPENDENT: 0, COMPANY: 0 };
  const orchardsByOwnership = { INDEPENDENT: 0, COMPANY: 0 };
  let orchardCount = 0;

  for (const registration of registrations || []) {
    const ownership = registration.ownership === 'COMPANY' ? 'COMPANY' : 'INDEPENDENT';
    farmersByOwnership[ownership] += 1;
    const villageLabel = collapseName(registration.village) || 'Unknown';
    const villageKey = norm(villageLabel) || 'unknown';
    if (!byVillage.has(villageKey)) {
      byVillage.set(villageKey, { village: villageLabel, farmers: 0 });
    }
    byVillage.get(villageKey).farmers += 1;

    const cropsSeen = new Set();
    for (const orchard of registration.orchards || []) {
      orchardCount += 1;
      orchardsByOwnership[ownership] += 1;
      const cropsHere = new Set(
        (orchard.crops || []).map((line) => norm(line.crop)).filter(Boolean)
      );
      for (const cropKey of cropsHere) {
        if (!byCrop.has(cropKey)) {
          const sample = (orchard.crops || []).find((line) => norm(line.crop) === cropKey);
          byCrop.set(cropKey, { crop: collapseName(sample?.crop) || cropKey, farmers: 0, orchards: 0 });
        }
        const bucket = byCrop.get(cropKey);
        bucket.orchards += 1;
        if (!cropsSeen.has(cropKey)) {
          cropsSeen.add(cropKey);
          bucket.farmers += 1;
        }
      }
    }
  }

  const targetRows = (targets || []).map((target) => {
    const key = norm(target.crop);
    const farmerCount = byCrop.get(key)?.farmers || 0;
    const goalCount = Number(target.goalCount) || 0;
    const priorityVillages = Array.isArray(target.priorityVillages) ? target.priorityVillages : [];
    const priority = new Set(priorityVillages.map((village) => norm(village)));
    let farmersInPriorityVillages = 0;
    for (const registration of registrations || []) {
      const hasCrop = (registration.orchards || []).some((orchard) =>
        (orchard.crops || []).some((line) => norm(line.crop) === key)
      );
      if (hasCrop && priority.has(norm(registration.village))) farmersInPriorityVillages += 1;
    }
    const deadline = asDateOnly(target.deadline);
    return {
      crop: target.crop,
      goalCount,
      farmerCount,
      remaining: Math.max(goalCount - farmerCount, 0),
      met: goalCount > 0 && farmerCount >= goalCount,
      deadline,
      priorityVillages,
      farmersInPriorityVillages
    };
  });

  return {
    registrations: (registrations || []).length,
    orchards: orchardCount,
    byCrop: [...byCrop.values()].sort((a, b) => a.crop.localeCompare(b.crop)),
    byVillage: [...byVillage.values()].sort(
      (a, b) => b.farmers - a.farmers || a.village.localeCompare(b.village)
    ),
    byOwnership: {
      farmers: farmersByOwnership,
      orchards: orchardsByOwnership
    },
    targets: targetRows,
    generatedAt: now.toISOString()
  };
}

const reportSelect = {
  id: true,
  village: true,
  ownership: true,
  orchards: {
    select: {
      id: true,
      crops: { select: { crop: true } }
    }
  }
};

export async function loadFarmerReport(prisma, now = new Date()) {
  const [registrations, targets] = await Promise.all([
    prisma.farmerRegistration.findMany({ select: reportSelect }),
    prisma.sourcingTarget.findMany({ orderBy: { crop: 'asc' } })
  ]);
  return buildFarmerReport(registrations, targets, now);
}

export const registrationInclude = {
  orchards: {
    orderBy: { createdAt: 'asc' },
    include: { crops: { orderBy: { createdAt: 'asc' } } }
  }
};
