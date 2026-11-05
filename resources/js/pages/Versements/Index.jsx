import { Head, Link } from "@inertiajs/react";

export default function Index({ versements }) {
    const formatMontant = (montant) => {
        return Number(montant).toLocaleString("fr-FR") + " FCFA";
    };

    const getStatutLabel = (statut) => {
        switch (statut) {
            case "paye":
                return "Payé";
            case "partiel":
                return "Partiel";
            default:
                return "En attente";
        }
    };

    return (
        <>
            <Head title="Versements" />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Versements</h1>

                        <p className="text-gray-600">
                            Suivi des versements des chauffeurs
                        </p>
                    </div>

                    <Link
                        href="/versements/create"
                        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        + Nouveau versement
                    </Link>
                </div>

                <div className="overflow-hidden rounded-lg bg-white shadow">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left">Chauffeur</th>

                                <th className="p-3 text-left">Véhicule</th>

                                <th className="p-3 text-left">Période</th>

                                <th className="p-3 text-left">Montant dû</th>

                                <th className="p-3 text-left">Montant payé</th>

                                <th className="p-3 text-left">Arriéré</th>

                                <th className="p-3 text-left">Statut</th>

                                <th className="p-3 text-left">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {versements.map((versement) => (
                                <tr key={versement.id} className="border-t">
                                    <td className="p-3">
                                        {versement.contrat?.chauffeur?.nom}
                                    </td>

                                    <td className="p-3">
                                        {
                                            versement.contrat?.vehicule
                                                ?.immatriculation
                                        }
                                    </td>

                                    <td className="p-3">
                                        {versement.periode_debut}
                                        {" → "}
                                        {versement.periode_fin}
                                    </td>

                                    <td className="p-3 font-medium">
                                        {formatMontant(versement.montant_du)}
                                    </td>

                                    <td className="p-3">
                                        {formatMontant(versement.montant_paye)}
                                    </td>

                                    <td className="p-3">
                                        {formatMontant(
                                            versement.nouvel_arriere,
                                        )}
                                    </td>

                                    <td className="p-3">
                                        {getStatutLabel(versement.statut)}
                                    </td>

                                    <td className="p-3">
                                        <Link
                                            href={`/versements/${versement.id}`}
                                            className="text-blue-600 hover:underline font-medium"
                                        >
                                            Voir les détails
                                        </Link>
                                    </td>
                                </tr>
                            ))}

                            {versements.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="8"
                                        className="p-6 text-center text-gray-500"
                                    >
                                        Aucun versement enregistré.
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
