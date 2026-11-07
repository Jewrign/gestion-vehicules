import { Head, Link, useForm } from "@inertiajs/react";

export default function Edit({ depense, vehicules }) {
    const { data, setData, put, processing, errors } = useForm({
        vehicule_id: String(depense.vehicule_id),
        type: depense.type,
        description: depense.description || "",
        montant: depense.montant,
        date: depense.date,
        deductible: Boolean(depense.deductible),
        montant_deduit: depense.montant_deduit || 0,
    });

    const submit = (e) => {
        e.preventDefault();
        put(`/depenses/${depense.id}`);
    };

    return (
        <>
            <Head title="Modifier une dépense" />

            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Modifier une dépense</h1>
                    <p className="text-gray-600">
                        Modifier les informations de cette dépense.
                    </p>
                </div>

                <form
                    onSubmit={submit}
                    className="max-w-2xl space-y-5 rounded-lg bg-white p-6 shadow"
                >
                    <div>
                        <label className="mb-1 block font-medium">
                            Véhicule
                        </label>

                        <select
                            value={data.vehicule_id}
                            onChange={(e) =>
                                setData("vehicule_id", e.target.value)
                            }
                            className="w-full rounded border p-2"
                            required
                        >
                            <option value="">Sélectionner un véhicule</option>

                            {vehicules.map((vehicule) => (
                                <option key={vehicule.id} value={vehicule.id}>
                                    {vehicule.immatriculation} - {vehicule.type}
                                </option>
                            ))}
                        </select>

                        {errors.vehicule_id && (
                            <p className="text-sm text-red-600">
                                {errors.vehicule_id}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block font-medium">
                            Type de dépense
                        </label>

                        <input
                            type="text"
                            value={data.type}
                            onChange={(e) => setData("type", e.target.value)}
                            className="w-full rounded border p-2"
                            required
                        />

                        {errors.type && (
                            <p className="text-sm text-red-600">
                                {errors.type}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block font-medium">
                            Description
                        </label>

                        <textarea
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            className="w-full rounded border p-2"
                            rows="3"
                        />

                        {errors.description && (
                            <p className="text-sm text-red-600">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block font-medium">
                            Montant (FCFA)
                        </label>

                        <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={data.montant}
                            onChange={(e) => {
                                const montant = e.target.value;
                                setData("montant", montant);

                                if (
                                    Number(data.montant_deduit) >
                                    Number(montant)
                                ) {
                                    setData("montant_deduit", 0);
                                }
                            }}
                            className="w-full rounded border p-2"
                            required
                        />

                        {errors.montant && (
                            <p className="text-sm text-red-600">
                                {errors.montant}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block font-medium">
                            Date de la dépense
                        </label>

                        <input
                            type="date"
                            value={data.date}
                            onChange={(e) => setData("date", e.target.value)}
                            className="w-full rounded border p-2"
                            required
                        />

                        {errors.date && (
                            <p className="text-sm text-red-600">
                                {errors.date}
                            </p>
                        )}
                    </div>

                    <div className="border-t pt-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={data.deductible}
                                onChange={(e) => {
                                    const deductible = e.target.checked;

                                    setData("deductible", deductible);

                                    if (!deductible) {
                                        setData("montant_deduit", 0);
                                    }
                                }}
                            />

                            <span className="font-medium">
                                Cette dépense est déductible du versement
                            </span>
                        </label>
                    </div>

                    {data.deductible && (
                        <div>
                            <label className="mb-1 block font-medium">
                                Montant à déduire (FCFA)
                            </label>

                            <input
                                type="number"
                                min="0"
                                max={data.montant || 0}
                                step="0.01"
                                value={data.montant_deduit}
                                onChange={(e) =>
                                    setData("montant_deduit", e.target.value)
                                }
                                className="w-full rounded border p-2"
                            />

                            {errors.montant_deduit && (
                                <p className="text-sm text-red-600">
                                    {errors.montant_deduit}
                                </p>
                            )}
                        </div>
                    )}

                    <div className="flex items-center gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing
                                ? "Modification..."
                                : "Enregistrer les modifications"}
                        </button>

                        <Link
                            href="/depenses"
                            className="rounded border px-5 py-2 hover:bg-gray-50"
                        >
                            Annuler
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}
