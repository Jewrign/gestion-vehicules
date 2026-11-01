import { Head, Link, useForm } from "@inertiajs/react";

export default function Edit({ contrat, chauffeurs }) {
    const { data, setData, put, processing, errors } = useForm({
        chauffeur_id: contrat.chauffeur_id,
        date_debut: contrat.date_debut,
    });

    const submit = (e) => {
        e.preventDefault();
        put(`/contrats/${contrat.id}`);
    };

    return (
        <>
            <Head title="Modifier le contrat" />

            <div className="p-6">
                <div className="mb-6">
                    <Link
                        href="/contrats"
                        className="text-blue-600 hover:underline"
                    >
                        ← Retour aux contrats
                    </Link>

                    <h1 className="mt-3 text-2xl font-bold">
                        Modifier le contrat
                    </h1>
                </div>

                <form
                    onSubmit={submit}
                    className="max-w-xl space-y-5 rounded-lg bg-white p-6 shadow"
                >
                    <div>
                        <label className="mb-1 block font-medium">
                            Véhicule
                        </label>

                        <input
                            type="text"
                            value={`${contrat.vehicule.immatriculation} — ${contrat.vehicule.type}`}
                            disabled
                            className="w-full rounded border bg-gray-100 p-2"
                        />

                        <p className="mt-1 text-sm text-gray-500">
                            Le véhicule ne peut pas être modifié sur un contrat
                            existant.
                        </p>
                    </div>

                    <div>
                        <label className="mb-1 block font-medium">
                            Chauffeur
                        </label>

                        <select
                            value={data.chauffeur_id}
                            onChange={(e) =>
                                setData("chauffeur_id", e.target.value)
                            }
                            className="w-full rounded border p-2"
                        >
                            {chauffeurs.map((chauffeur) => (
                                <option key={chauffeur.id} value={chauffeur.id}>
                                    {chauffeur.nom} — {chauffeur.numero_permis}
                                </option>
                            ))}
                        </select>

                        {errors.chauffeur_id && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.chauffeur_id}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block font-medium">
                            Date de début
                        </label>

                        <input
                            type="date"
                            value={data.date_debut}
                            onChange={(e) =>
                                setData("date_debut", e.target.value)
                            }
                            className="w-full rounded border p-2"
                        />

                        {errors.date_debut && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.date_debut}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {processing
                            ? "Modification..."
                            : "Enregistrer les modifications"}
                    </button>
                </form>
            </div>
        </>
    );
}
