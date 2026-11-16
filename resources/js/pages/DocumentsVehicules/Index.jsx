import { Head, Link, router } from "@inertiajs/react";

export default function Index({ documents }) {
    const formatMontant = (montant) =>
        Number(montant).toLocaleString("fr-FR") + " FCFA";

    const formatDate = (date) => {
        if (!date) return "—";
        return new Date(
            String(date).slice(0, 10) + "T00:00:00",
        ).toLocaleDateString("fr-FR");
    };

    const estExpire = (date) =>
        String(date).slice(0, 10) < new Date().toISOString().slice(0, 10);

    const supprimer = (id) => {
        if (confirm("Voulez-vous vraiment supprimer ce document ?")) {
            router.delete(`/documents-vehicules/${id}`);
        }
    };

    return (
        <>
            <Head title="Documents véhicules" />

            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Documents véhicules</h1>

                    <Link
                        href="/documents-vehicules/create"
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Ajouter un document
                    </Link>
                </div>

                <div className="overflow-x-auto bg-white rounded shadow">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3">Véhicule</th>
                                <th className="p-3">Type</th>
                                <th className="p-3">Date de début</th>
                                <th className="p-3">Expiration</th>
                                <th className="p-3">Montant</th>
                                <th className="p-3">Photo</th>
                                <th className="p-3">État</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {documents.length > 0 ? (
                                documents.map((document) => (
                                    <tr key={document.id} className="border-t">
                                        <td className="p-3">
                                            {document.vehicule?.immatriculation}
                                        </td>

                                        <td className="p-3">
                                            {document.type === "assurance"
                                                ? "Assurance"
                                                : "Visite technique"}
                                        </td>

                                        <td className="p-3">
                                            {formatDate(document.date_debut)}
                                        </td>

                                        <td className="p-3">
                                            {formatDate(
                                                document.date_expiration,
                                            )}
                                        </td>

                                        <td className="p-3">
                                            {formatMontant(document.montant)}
                                        </td>

                                        <td className="p-3">
                                            {document.photo ? (
                                                <a
                                                    href={`/storage/${document.photo}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-blue-600 underline"
                                                >
                                                    Voir
                                                </a>
                                            ) : (
                                                "Aucune"
                                            )}
                                        </td>

                                        <td className="p-3">
                                            {estExpire(
                                                document.date_expiration,
                                            ) ? (
                                                <span className="text-red-600 font-semibold">
                                                    Expiré
                                                </span>
                                            ) : (
                                                <span className="text-green-600 font-semibold">
                                                    Valide
                                                </span>
                                            )}
                                        </td>

                                        <td className="p-3 whitespace-nowrap">
                                            <Link
                                                href={`/documents-vehicules/${document.id}/edit`}
                                                className="text-blue-600 mr-3"
                                            >
                                                Modifier
                                            </Link>

                                            <button
                                                onClick={() =>
                                                    supprimer(document.id)
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
                                    <td colSpan="8" className="p-4 text-center">
                                        Aucun document enregistré.
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
