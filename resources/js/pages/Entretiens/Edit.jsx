import { Head, Link, useForm } from "@inertiajs/react";

export default function Edit({ entretien, vehicules }) {
    const { data, setData, put, processing, errors } = useForm({
        vehicule_id: String(entretien.vehicule_id),
        type: entretien.type,
        date: entretien.date,
        montant: entretien.montant,
        description: entretien.description || "",
    });

    const submit = (e) => {
        e.preventDefault();
        put(`/entretiens/${entretien.id}`);
    };

    return (
        <>
            <Head title="Modifier un entretien" />

            <div className="p-6 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">
                    Modifier l'entretien
                </h1>

                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <label className="block mb-2">Véhicule</label>

                        <select
                            value={data.vehicule_id}
                            onChange={(e) =>
                                setData("vehicule_id", e.target.value)
                            }
                            className="w-full border rounded p-2"
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
                            <p className="text-red-600 text-sm">
                                {errors.vehicule_id}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-2">Type d'entretien</label>

                        <input
                            type="text"
                            value={data.type}
                            onChange={(e) => setData("type", e.target.value)}
                            className="w-full border rounded p-2"
                            required
                        />

                        {errors.type && (
                            <p className="text-red-600 text-sm">
                                {errors.type}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-2">Date</label>

                        <input
                            type="date"
                            value={data.date}
                            onChange={(e) => setData("date", e.target.value)}
                            className="w-full border rounded p-2"
                            required
                        />

                        {errors.date && (
                            <p className="text-red-600 text-sm">
                                {errors.date}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-2">Montant (FCFA)</label>

                        <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={data.montant}
                            onChange={(e) => setData("montant", e.target.value)}
                            className="w-full border rounded p-2"
                            required
                        />

                        {errors.montant && (
                            <p className="text-red-600 text-sm">
                                {errors.montant}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-2">Description</label>

                        <textarea
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            className="w-full border rounded p-2"
                            rows="3"
                        />

                        {errors.description && (
                            <p className="text-red-600 text-sm">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Enregistrer les modifications
                        </button>

                        <Link
                            href="/entretiens"
                            className="bg-gray-200 px-4 py-2 rounded"
                        >
                            Annuler
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}
