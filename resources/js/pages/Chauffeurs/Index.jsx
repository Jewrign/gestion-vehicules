import { Head, Link, useForm } from "@inertiajs/react";

export default function Index({ chauffeurs }) {
    const { delete: destroy, processing } = useForm();

    const supprimer = (id) => {
        if (confirm("Voulez-vous vraiment supprimer ce chauffeur ?")) {
            destroy(`/chauffeurs/${id}`);
        }
    };

    return (
        <>
            <Head title="Chauffeurs" />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Chauffeurs</h1>
                        <p className="text-gray-600">Gestion des chauffeurs</p>
                    </div>

                    <Link
                        href="/chauffeurs/create"
                        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        + Ajouter un chauffeur
                    </Link>
                </div>

                <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-3 text-left">Nom</th>
                                    <th className="p-3 text-left">Téléphone</th>
                                    <th className="p-3 text-left">
                                        Numéro de permis
                                    </th>
                                    <th className="p-3 text-left">Statut</th>
                                    <th className="p-3 text-left">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {chauffeurs.map((chauffeur) => (
                                    <tr key={chauffeur.id} className="border-t">
                                        <td className="p-3">{chauffeur.nom}</td>

                                        <td className="p-3">
                                            {chauffeur.telephone}
                                        </td>

                                        <td className="p-3">
                                            {chauffeur.numero_permis ??
                                                "Non renseigné"}
                                        </td>

                                        <td className="p-3">
                                            {chauffeur.statut
                                                ? "Actif"
                                                : "Inactif"}
                                        </td>

                                        <td className="p-3">
                                            <div className="flex gap-3">
                                                <Link
                                                    href={`/chauffeurs/${chauffeur.id}/edit`}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    Modifier
                                                </Link>

                                                <button
                                                    type="button"
                                                    disabled={processing}
                                                    onClick={() =>
                                                        supprimer(chauffeur.id)
                                                    }
                                                    className="text-red-600 hover:underline disabled:opacity-50"
                                                >
                                                    Supprimer
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {chauffeurs.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="p-6 text-center text-gray-500"
                                        >
                                            Aucun chauffeur enregistré.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
