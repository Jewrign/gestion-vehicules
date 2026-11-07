import { Head, Link, router } from "@inertiajs/react";

export default function Index({ depenses }) {
    const formatMontant = (montant) => {
        return Number(montant || 0).toLocaleString("fr-FR") + " FCFA";
    };

    const supprimerDepense = (depense) => {
        if (confirm("Voulez-vous vraiment supprimer cette dépense ?")) {
            router.delete(`/depenses/${depense.id}`);
        }
    };

    return (
        <>
            <Head title="Dépenses" />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Dépenses</h1>
                        <p className="text-gray-600">
                            Suivi des dépenses des véhicules
                        </p>
                    </div>

                    <Link
                        href="/depenses/create"
                        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        + Nouvelle dépense
                    </Link>
                </div>

                <div className="overflow-x-auto rounded-lg bg-white shadow">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left">Véhicule</th>
                                <th className="p-3 text-left">Type</th>
                                <th className="p-3 text-left">Date</th>
                                <th className="p-3 text-left">Montant</th>
                                <th className="p-3 text-left">Déductible</th>
                                <th className="p-3 text-left">
                                    Montant déduit
                                </th>
                                <th className="p-3 text-left">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {depenses.map((depense) => (
                                <tr key={depense.id} className="border-t">
                                    <td className="p-3">
                                        {depense.vehicule?.immatriculation}
                                    </td>

                                    <td className="p-3">{depense.type}</td>

                                    <td className="p-3">{depense.date}</td>

                                    <td className="p-3 font-medium">
                                        {formatMontant(depense.montant)}
                                    </td>

                                    <td className="p-3">
                                        {depense.deductible ? "Oui" : "Non"}
                                    </td>

                                    <td className="p-3">
                                        {formatMontant(depense.montant_deduit)}
                                    </td>

                                    <td className="p-3">
                                        <div className="flex gap-3">
                                            <Link
                                                href={`/depenses/${depense.id}/edit`}
                                                className="text-blue-600 hover:underline"
                                            >
                                                Modifier
                                            </Link>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    supprimerDepense(depense)
                                                }
                                                className="text-red-600 hover:underline"
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {depenses.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="p-6 text-center text-gray-500"
                                    >
                                        Aucune dépense enregistrée.
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
