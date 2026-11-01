import { Head, Link, router } from "@inertiajs/react";

export default function Index({ contrats }) {
    const terminer = (id) => {
        if (confirm("Voulez-vous vraiment terminer ce contrat ?")) {
            router.put(`/contrats/${id}/terminer`);
        }
    };

    return (
        <>
            <Head title="Contrats" />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Contrats</h1>
                        <p className="text-gray-600">
                            Gestion des contrats chauffeur-véhicule
                        </p>
                    </div>

                    <Link
                        href="/contrats/create"
                        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        + Nouveau contrat
                    </Link>
                </div>

                <div className="overflow-hidden rounded-lg bg-white shadow">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left">Chauffeur</th>
                                <th className="p-3 text-left">Véhicule</th>
                                <th className="p-3 text-left">Début</th>
                                <th className="p-3 text-left">Montant/jour</th>
                                <th className="p-3 text-left">Paiement</th>
                                <th className="p-3 text-left">Statut</th>
                                <th className="p-3 text-left">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {contrats.map((contrat) => (
                                <tr key={contrat.id} className="border-t">
                                    <td className="p-3">
                                        {contrat.chauffeur?.nom}
                                    </td>

                                    <td className="p-3">
                                        {contrat.vehicule?.immatriculation}
                                    </td>

                                    <td className="p-3">
                                        {contrat.date_debut}
                                    </td>

                                    <td className="p-3">
                                        {Number(
                                            contrat.montant_journalier,
                                        ).toLocaleString("fr-FR")}{" "}
                                        FCFA
                                    </td>

                                    <td className="p-3">
                                        {contrat.jour_paiement ?? "Chaque jour"}
                                    </td>

                                    <td className="p-3">
                                        {contrat.statut === "actif"
                                            ? "Actif"
                                            : "Terminé"}
                                    </td>

                                    <td className="p-3">
                                        <div className="flex gap-2">
                                            <Link
                                                href={`contrats/${contrat.id}/edit`}
                                                className="text-blue-600 hover:underline"
                                            >
                                                Modifier
                                            </Link>

                                            {contrat.statut === "actif" && (
                                                <button
                                                    onClick={() =>
                                                        terminer(contrat.id)
                                                    }
                                                    className="text-red-600 hover:underline"
                                                >
                                                    Terminer
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {contrats.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="p-6 text-center text-gray-500"
                                    >
                                        Aucun contrat enregistré.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
