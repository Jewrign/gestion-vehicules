import { Head, Link, useForm } from "@inertiajs/react";

export default function Edit({ panne, vehicules }) {
    const { data, setData, put, processing, errors } = useForm({
        vehicule_id: String(panne.vehicule_id),
        date: panne.date,
        description: panne.description || "",
        jour_complet: Boolean(panne.jour_complet),
    });

    const submit = (e) => {
        e.preventDefault();
        put(`/pannes/${panne.id}`);
    };

    return (
        <>
            <Head title="Modifier une panne" />

            <div className="p-6 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Modifier la panne</h1>

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
                        <label className="block mb-2">Date de la panne</label>
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
                        <label className="block mb-2">Description</label>
                        <textarea
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            className="w-full border rounded p-2"
                            rows="3"
                            placeholder="Décrire la panne..."
                        />

                        {errors.description && (
                            <p className="text-red-600 text-sm">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={data.jour_complet}
                                onChange={(e) =>
                                    setData("jour_complet", e.target.checked)
                                }
                            />
                            Véhicule immobilisé toute la journée
                        </label>
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
                            href="/pannes"
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
