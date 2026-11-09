import { Head, Link, router } from "@inertiajs/react";

export default function Index({ entretiens }) {
    const supprimerEntretien = (id) => {
        if (confirm("Voulez-vous vraiment supprimer cet entretien ?")) {
            router.delete(`/entretiens/${id}`);
        }
    };

    const formatMontant = (montant) =>
        Number(montant).toLocaleString("fr-FR") + " FCFA";

    return (
        <>
            <Head title="Entretiens" />

            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">
                        Gestion des entretiens
                    </h1>

                    <Link
                        href="/entretiens/create"
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Ajouter un entretien
                    </Link>
                </div>

                <div className="overflow-x-auto bg-white rounded shadow">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3">Véhicule</th>
                                <th className="p-3">Type</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Montant</th>
                                <th className="p-3">Description</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {entretiens.length > 0 ? (
                                entretiens.map((entretien) => (
                                    <tr key={entretien.id} className="border-t">
                                        <td className="p-3">
                                            {
                                                entretien.vehicule
                                                    ?.immatriculation
                                            }
                                        </td>

                                        <td className="p-3">
                                            {entretien.type}
                                        </td>

                                        <td className="p-3">
                                            {entretien.date}
                                        </td>

                                        <td className="p-3">
                                            {formatMontant(entretien.montant)}
                                        </td>

                                        <td className="p-3">
                                            {entretien.description || "-"}
                                        </td>

                                        <td className="p-3">
                                            <div className="flex gap-3">
                                                <Link
                                                    href={`/entretiens/${entretien.id}/edit`}
                                                    className="text-blue-600"
                                                >
                                                    Modifier
                                                </Link>

                                                <button
                                                    onClick={() =>
                                                        supprimerEntretien(
                                                            entretien.id,
                                                        )
                                                    }
                                                    className="text-red-600"
                                                >
                                                    Supprimer
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="p-6 text-center text-gray-500"
                                    >
                                        Aucun entretien enregistré.
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
