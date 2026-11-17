"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { farmersApi } from '../../lib/api';
import { FormAlert } from '../forms/FormAlert';

const CROP_SUGGESTIONS = ['avocado', 'macadamia'];
const VARIETY_SUGGESTIONS = ['Hass', 'Fuerte', 'Pinkerton', 'Beaumont'];
const VILLAGE_SUGGESTIONS = ['Kahohi', 'Karimamwaro', 'Maganjo', 'Kairungu', 'Kiamambo', 'Sagana'];

const inputClass =
  'w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-soko-orange';
const inputErrorClass =
  'w-full rounded-xl border border-red-400 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-400';

function blankCrop() {
  return { crop: '', variety: '', yearPlanted: '', lastSprayDate: '', estimatedKgPerSeason: '' };
}

function blankOrchard() {
  return {
    name: '',
    latitude: '',
    longitude: '',
    pinDescription: '',
    acreage: '',
    treeCount: '',
    notes: '',
    crops: [blankCrop()]
  };
}

function numberOrUndefined(value) {
  if (value === '' || value == null) return undefined;
  return Number(value);
}

function detailsToMap(details) {
  const map = {};
  for (const detail of details || []) {
    if (!detail?.field) continue;
    map[detail.field] = map[detail.field] ? `${map[detail.field]} ${detail.message}` : detail.message;
  }
  return map;
}

function FieldError({ errors, name }) {
  if (!errors[name]) return null;
  return (
    <p id={`${name}-error`} className="mt-1 text-sm text-red-700" role="alert">
      {errors[name]}
    </p>
  );
}

function TextInput({ label, name, errors, ...props }) {
  const invalid = Boolean(errors[name]);
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-soko-dark-teal mb-1">
        {label}
      </label>
      <input
        id={name}
        name={name}
        aria-invalid={invalid}
        aria-describedby={invalid ? `${name}-error` : undefined}
        className={invalid ? inputErrorClass : inputClass}
        {...props}
      />
      <FieldError errors={errors} name={name} />
    </div>
  );
}

export default function FarmerRegistrationForm() {
  const { isAuthenticated, user, loading } = useAuth();
  const [form, setForm] = useState({
    fullName: '',
    nationalIdNumber: '',
    phone: '',
    village: '',
    ownership: 'INDEPENDENT',
    notes: '',
    accepted: false,
    acceptedFullName: '',
    orchards: [blankOrchard()]
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!user) return;
    const name = [user.firstName, user.lastName].filter(Boolean).join(' ');
    setForm((current) => ({
      ...current,
      fullName: current.fullName || name,
      phone: current.phone || user.phone || ''
    }));
  }, [user]);

  if (loading) {
    return <p className="text-gray-600">Loading your account…</p>;
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-soko-dark-teal mb-2">Sign in to register an orchard</h2>
        <p className="text-gray-600 mb-6">
          An account is required. Registering an orchard does not approve a seller account and no payment is taken.
        </p>
        <div className="flex gap-3">
          <Link
            href="/auth/login?redirect=/sell/register"
            className="flex-1 text-center py-3 rounded-xl bg-soko-orange text-white font-bold hover:bg-soko-dark-red"
          >
            Log in
          </Link>
          <Link
            href="/auth/register?redirect=/sell/register"
            className="flex-1 text-center py-3 rounded-xl border border-soko-dark-teal text-soko-dark-teal font-bold hover:bg-soko-cream/40"
          >
            Create account
          </Link>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm" data-testid="registration-success">
        <FormAlert message={result.confirmation?.payment} type="success" />
        <h2 className="text-2xl font-bold text-soko-dark-teal mb-2">{result.confirmation?.headline}</h2>
        <p className="text-gray-700 mb-2">{result.confirmation?.detail}</p>
        <p className="text-gray-700 mb-4" data-testid="registration-payment">
          {result.confirmation?.payment}
        </p>
        <p className="text-sm text-gray-600 mb-6">
          Status: {result.registration?.status === 'REVIEWED' ? 'Reviewed' : 'Submitted'}.
          {result.emailSent
            ? ' A confirmation email was sent to your account. It does not include your ID number.'
            : ' This page is your confirmation.'}
        </p>
        <Link
          href="/sell/registrations"
          className="inline-block py-3 px-6 rounded-xl bg-soko-orange text-white font-bold hover:bg-soko-dark-red"
        >
          View registration status
        </Link>
      </div>
    );
  }

  function updateOrchard(index, patch) {
    setForm((current) => ({
      ...current,
      orchards: current.orchards.map((orchard, i) => (i === index ? { ...orchard, ...patch } : orchard))
    }));
  }

  function updateCrop(orchardIndex, cropIndex, patch) {
    setForm((current) => ({
      ...current,
      orchards: current.orchards.map((orchard, i) => {
        if (i !== orchardIndex) return orchard;
        return {
          ...orchard,
          crops: orchard.crops.map((crop, j) => (j === cropIndex ? { ...crop, ...patch } : crop))
        };
      })
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError('');
    setErrors({});
    setSubmitting(true);
    try {
      const saved = await farmersApi.create({
        fullName: form.fullName,
        nationalIdNumber: form.nationalIdNumber,
        phone: form.phone,
        village: form.village,
        ownership: form.ownership,
        notes: form.notes || undefined,
        accepted: form.accepted === true,
        acceptedFullName: form.acceptedFullName,
        orchards: form.orchards.map((orchard) => ({
          name: orchard.name,
          latitude: numberOrUndefined(orchard.latitude),
          longitude: numberOrUndefined(orchard.longitude),
          pinDescription: orchard.pinDescription || undefined,
          acreage: numberOrUndefined(orchard.acreage),
          treeCount: numberOrUndefined(orchard.treeCount),
          notes: orchard.notes || undefined,
          crops: orchard.crops.map((crop) => ({
            crop: crop.crop,
            variety: crop.variety || undefined,
            yearPlanted: numberOrUndefined(crop.yearPlanted),
            lastSprayDate: crop.lastSprayDate || undefined,
            estimatedKgPerSeason: numberOrUndefined(crop.estimatedKgPerSeason)
          }))
        }))
      });
      setResult(saved);
    } catch (err) {
      setErrors(detailsToMap(err.details));
      setFormError(err.details?.length ? 'Check the highlighted fields.' : err.message || 'Could not save the registration');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm space-y-8" noValidate>
      <div>
        <h2 className="text-2xl font-bold text-soko-dark-teal mb-2">Register an orchard</h2>
        <p className="text-gray-600">
          This is a sourcing record for an orchard producer. No payment is taken and it does not approve a seller account.
          Crop, variety, and village are open text — the suggestions are only a starting list.
        </p>
      </div>

      <FormAlert message={formError} />

      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-soko-dark-teal">Farmer</legend>
        <TextInput
          label="Name *"
          name="fullName"
          errors={errors}
          value={form.fullName}
          onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
        />
        <TextInput
          label="National ID number *"
          name="nationalIdNumber"
          errors={errors}
          autoComplete="off"
          value={form.nationalIdNumber}
          onChange={(event) => setForm((current) => ({ ...current, nationalIdNumber: event.target.value }))}
        />
        <p className="text-xs text-gray-500 -mt-2">Stored securely. Lists show only the last 4 characters.</p>
        <TextInput
          label="Phone *"
          name="phone"
          errors={errors}
          value={form.phone}
          onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
        />
        <div>
          <label htmlFor="village" className="block text-sm font-medium text-soko-dark-teal mb-1">
            Village *
          </label>
          <input
            id="village"
            name="village"
            list="village-suggestions"
            value={form.village}
            onChange={(event) => setForm((current) => ({ ...current, village: event.target.value }))}
            className={errors.village ? inputErrorClass : inputClass}
            aria-invalid={Boolean(errors.village)}
          />
          <datalist id="village-suggestions">
            {VILLAGE_SUGGESTIONS.map((village) => (
              <option key={village} value={village} />
            ))}
          </datalist>
          <p className="mt-1 text-xs text-gray-500">
            Priority villages: {VILLAGE_SUGGESTIONS.join(', ')}. Other villages are accepted.
          </p>
          <FieldError errors={errors} name="village" />
        </div>
        <fieldset>
          <legend className="block text-sm font-medium text-soko-dark-teal mb-2">Ownership *</legend>
          <div className="flex flex-col sm:flex-row gap-3">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="ownership"
                value="INDEPENDENT"
                checked={form.ownership === 'INDEPENDENT'}
                onChange={() => setForm((current) => ({ ...current, ownership: 'INDEPENDENT' }))}
              />
              Independent farmer
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="ownership"
                value="COMPANY"
                checked={form.ownership === 'COMPANY'}
                onChange={() => setForm((current) => ({ ...current, ownership: 'COMPANY' }))}
              />
              Company orchard
            </label>
          </div>
          <FieldError errors={errors} name="ownership" />
        </fieldset>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-soko-dark-teal mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={form.notes}
            onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
            className={errors.notes ? inputErrorClass : inputClass}
            placeholder="Optional. Use this for anything the form does not ask yet."
          />
          <FieldError errors={errors} name="notes" />
        </div>
      </fieldset>

      {form.orchards.map((orchard, index) => (
        <fieldset key={index} className="space-y-4 border border-soko-dark-teal/10 rounded-2xl p-4">
          <legend className="px-2 text-lg font-semibold text-soko-dark-teal">Orchard {index + 1}</legend>
          <TextInput
            label="Orchard name *"
            name={`orchards.${index}.name`}
            errors={errors}
            value={orchard.name}
            onChange={(event) => updateOrchard(index, { name: event.target.value })}
          />
          <div className="grid md:grid-cols-2 gap-4">
            <TextInput
              label="Latitude"
              name={`orchards.${index}.latitude`}
              errors={errors}
              inputMode="decimal"
              value={orchard.latitude}
              onChange={(event) => updateOrchard(index, { latitude: event.target.value })}
            />
            <TextInput
              label="Longitude"
              name={`orchards.${index}.longitude`}
              errors={errors}
              inputMode="decimal"
              value={orchard.longitude}
              onChange={(event) => updateOrchard(index, { longitude: event.target.value })}
            />
          </div>
          <TextInput
            label="Pin description"
            name={`orchards.${index}.pinDescription`}
            errors={errors}
            value={orchard.pinDescription}
            onChange={(event) => updateOrchard(index, { pinDescription: event.target.value })}
            placeholder="Optional landmark, such as below the coffee factory"
          />
          <div className="grid md:grid-cols-2 gap-4">
            <TextInput
              label="Acreage *"
              name={`orchards.${index}.acreage`}
              errors={errors}
              inputMode="decimal"
              value={orchard.acreage}
              onChange={(event) => updateOrchard(index, { acreage: event.target.value })}
            />
            <TextInput
              label="Number of trees *"
              name={`orchards.${index}.treeCount`}
              errors={errors}
              inputMode="numeric"
              value={orchard.treeCount}
              onChange={(event) => updateOrchard(index, { treeCount: event.target.value })}
            />
          </div>
          <FieldError errors={errors} name={`orchards.${index}.crops`} />
          {orchard.crops.map((crop, cropIndex) => (
            <div key={cropIndex} className="grid md:grid-cols-2 gap-4 bg-soko-cream/30 rounded-xl p-4">
              <div>
                <label className="block text-sm font-medium text-soko-dark-teal mb-1" htmlFor={`crop-${index}-${cropIndex}`}>
                  Crop *
                </label>
                <input
                  id={`crop-${index}-${cropIndex}`}
                  list="crop-suggestions"
                  value={crop.crop}
                  onChange={(event) => updateCrop(index, cropIndex, { crop: event.target.value })}
                  className={errors[`orchards.${index}.crops.${cropIndex}.crop`] ? inputErrorClass : inputClass}
                />
                <FieldError errors={errors} name={`orchards.${index}.crops.${cropIndex}.crop`} />
              </div>
              <div>
                <label className="block text-sm font-medium text-soko-dark-teal mb-1" htmlFor={`variety-${index}-${cropIndex}`}>
                  Variety
                </label>
                <input
                  id={`variety-${index}-${cropIndex}`}
                  list="variety-suggestions"
                  value={crop.variety}
                  onChange={(event) => updateCrop(index, cropIndex, { variety: event.target.value })}
                  className={errors[`orchards.${index}.crops.${cropIndex}.variety`] ? inputErrorClass : inputClass}
                />
                <FieldError errors={errors} name={`orchards.${index}.crops.${cropIndex}.variety`} />
              </div>
              <TextInput
                label="Year planted *"
                name={`orchards.${index}.crops.${cropIndex}.yearPlanted`}
                errors={errors}
                inputMode="numeric"
                value={crop.yearPlanted}
                onChange={(event) => updateCrop(index, cropIndex, { yearPlanted: event.target.value })}
              />
              <TextInput
                label="Last spray date"
                name={`orchards.${index}.crops.${cropIndex}.lastSprayDate`}
                errors={errors}
                type="date"
                value={crop.lastSprayDate}
                onChange={(event) => updateCrop(index, cropIndex, { lastSprayDate: event.target.value })}
              />
              <TextInput
                label="Estimated kg per season *"
                name={`orchards.${index}.crops.${cropIndex}.estimatedKgPerSeason`}
                errors={errors}
                inputMode="decimal"
                value={crop.estimatedKgPerSeason}
                onChange={(event) => updateCrop(index, cropIndex, { estimatedKgPerSeason: event.target.value })}
              />
              {orchard.crops.length > 1 && (
                <div className="flex items-end">
                  <button
                    type="button"
                    className="text-sm text-red-700 hover:underline"
                    onClick={() =>
                      updateOrchard(index, {
                        crops: orchard.crops.filter((_, j) => j !== cropIndex)
                      })
                    }
                  >
                    Remove crop
                  </button>
                </div>
              )}
            </div>
          ))}
          <button
            type="button"
            className="text-sm font-semibold text-soko-dark-teal hover:underline"
            onClick={() => updateOrchard(index, { crops: [...orchard.crops, blankCrop()] })}
          >
            Add another crop
          </button>
          {form.orchards.length > 1 && (
            <button
              type="button"
              className="block text-sm text-red-700 hover:underline"
              onClick={() =>
                setForm((current) => ({
                  ...current,
                  orchards: current.orchards.filter((_, i) => i !== index)
                }))
              }
            >
              Remove orchard
            </button>
          )}
        </fieldset>
      ))}

      <button
        type="button"
        className="text-sm font-semibold text-soko-orange-red hover:underline"
        onClick={() => setForm((current) => ({ ...current, orchards: [...current.orchards, blankOrchard()] }))}
      >
        Add another orchard
      </button>

      <datalist id="crop-suggestions">
        {CROP_SUGGESTIONS.map((crop) => (
          <option key={crop} value={crop} />
        ))}
      </datalist>
      <datalist id="variety-suggestions">
        {VARIETY_SUGGESTIONS.map((variety) => (
          <option key={variety} value={variety} />
        ))}
      </datalist>

      <fieldset className="space-y-4 border-t border-gray-100 pt-6">
        <legend className="text-lg font-semibold text-soko-dark-teal">Acceptance</legend>
        <p className="text-sm text-gray-600">
          Type the same full name and tick the box. We record the time on the server. No fee is charged.
        </p>
        <TextInput
          label="Type your full name *"
          name="acceptedFullName"
          errors={errors}
          value={form.acceptedFullName}
          onChange={(event) => setForm((current) => ({ ...current, acceptedFullName: event.target.value }))}
        />
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            className="mt-1"
            checked={form.accepted}
            onChange={(event) => setForm((current) => ({ ...current, accepted: event.target.checked }))}
          />
          <span>I accept this registration form. No payment is due.</span>
        </label>
        <FieldError errors={errors} name="accepted" />
      </fieldset>

      <button
        type="submit"
        disabled={submitting}
        className="py-3 px-6 rounded-xl bg-soko-orange text-white font-bold hover:bg-soko-dark-red disabled:opacity-60"
      >
        {submitting ? 'Saving…' : 'Submit registration'}
      </button>
    </form>
  );
}
