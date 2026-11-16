import { Head, Link, useForm } from "@inertiajs/react";

export default function Edit({ document, vehicules }) {
    const { data, setData, post, processing, errors, transform } = useForm({
        vehicule_id: document.vehicule_id,
        type: document.type,
        date_debut: document.date_debut
            ? String(document.date_debut).slice(0, 10)
            : "",
        date_expiration: String(document.date_expiration).slice(0, 10),
        montant: document.montant,
        photo: null,
    });

    const submit = (e) => {
        e.preventDefault();

        transform((formData) => ({
            ...formData,
            _method: "put",
        }));

        post(`/documents-vehicules/${document.id}`, {
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title="Modifier un document" />

            <div className="p-6 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">
                    Modifier le document
                </h1>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block mb-1">Véhicule</label>
                        <select
                            value={data.vehicule_id}
                            onChange={(e) =>
                                setData("vehicule_id", e.target.value)
                            }
                            className="w-full border rounded p-2"
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
                        <label className="block mb-1">Type de document</label>
                        <select
                            value={data.type}
                            onChange={(e) => setData("type", e.target.value)}
                            className="w-full border rounded p-2"
                        >
                            <option value="assurance">Assurance</option>
                            <option value="visite_technique">
                                Visite technique
                            </option>
                        </select>
                        {errors.type && (
                            <p className="text-red-600 text-sm">
                                {errors.type}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1">
                            Date de début / délivrance
                        </label>
                        <input
                            type="date"
                            value={data.date_debut}
                            onChange={(e) =>
                                setData("date_debut", e.target.value)
                            }
                            className="w-full border rounded p-2"
                        />
                        {errors.date_debut && (
                            <p className="text-red-600 text-sm">
                                {errors.date_debut}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1">Date d'expiration</label>
                        <input
                            type="date"
                            value={data.date_expiration}
                            onChange={(e) =>
                                setData("date_expiration", e.target.value)
                            }
                            className="w-full border rounded p-2"
                        />
                        {errors.date_expiration && (
                            <p className="text-red-600 text-sm">
                                {errors.date_expiration}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1">Montant (FCFA)</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={data.montant}
                            onChange={(e) => setData("montant", e.target.value)}
                            className="w-full border rounded p-2"
                        />
                        {errors.montant && (
                            <p className="text-red-600 text-sm">
                                {errors.montant}
                            </p>
                        )}
                    </div>

                    {document.photo && (
                        <div>
                            <p className="mb-2">Photo actuelle :</p>
                            <a
                                href={`/storage/${document.photo}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 underline"
                            >
                                Voir la photo actuelle
                            </a>
                        </div>
                    )}

                    <div>
                        <label className="block mb-1">
                            Nouvelle photo (facultative)
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setData("photo", e.target.files[0])
                            }
                            className="w-full border rounded p-2"
                        />
                        {errors.photo && (
                            <p className="text-red-600 text-sm">
                                {errors.photo}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            {processing
                                ? "Modification..."
                                : "Enregistrer les modifications"}
                        </button>

                        <Link
                            href="/documents-vehicules"
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
