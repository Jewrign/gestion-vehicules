import { Head, Link, router } from "@inertiajs/react";

export default function Index({ pannes }) {
    const supprimerPanne = (id) => {
        if (confirm("Voulez-vous vraiment supprimer cette panne ?")) {
            router.delete(`/pannes/${id}`);
        }
    };

    return (
        <>
            <Head title="Pannes" />

            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Gestion des pannes</h1>

                    <Link
                        href="/pannes/create"
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Ajouter une panne
                    </Link>
                </div>

                <div className="overflow-x-auto bg-white rounded shadow">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3">Véhicule</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Description</th>
                                <th className="p-3">Journée complète</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {pannes.length > 0 ? (
                                pannes.map((panne) => (
                                    <tr key={panne.id} className="border-t">
                                        <td className="p-3">
                                            {panne.vehicule?.immatriculation}
                                        </td>

                                        <td className="p-3">{panne.date}</td>

                                        <td className="p-3">
                                            {panne.description || "-"}
                                        </td>

                                        <td className="p-3">
                                            {panne.jour_complet ? "Oui" : "Non"}
                                        </td>

                                        <td className="p-3 flex gap-3">
                                            <Link
                                                href={`/pannes/${panne.id}/edit`}
                                                className="text-blue-600"
                                            >
                                                Modifier
                                            </Link>

                                            <button
                                                onClick={() =>
                                                    supprimerPanne(panne.id)
                                                }
                                                className="text-red-600"
                                            >
                                                Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="p-6 text-center text-gray-500"
                                    >
                                        Aucune panne enregistrée.
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
