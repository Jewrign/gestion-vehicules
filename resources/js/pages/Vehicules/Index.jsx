import { Head, Link, useForm } from "@inertiajs/react";

export default function Index({ vehicules }) {
    const { delete: destroy, processing } = useForm();

    const supprimer = (id) => {
        if (confirm("Voulez-vous vraiment supprimer ce véhicule ?")) {
            destroy(`/vehicules/${id}`);
        }
    };

    const formaterType = (type) => {
        const types = {
            moto: "Moto",
            voiture: "Voiture",
            car: "Car / Bus",
        };

        return types[type] ?? type;
    };

    const formaterStatut = (statut) => {
        const statuts = {
            actif: "Actif",
            immobilise: "Immobilisé",
            inactif: "Inactif",
        };

        return statuts[statut] ?? statut;
    };

    return (
        <>
            <Head title="Véhicules" />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Véhicules</h1>
                        <p className="text-gray-600">
                            Gestion du parc automobile
                        </p>
                    </div>

                    <Link
                        href="/vehicules/create"
                        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        + Ajouter un véhicule
                    </Link>
                </div>

                <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-3 text-left">
                                        Immatriculation
                                    </th>
                                    <th className="p-3 text-left">Type</th>
                                    <th className="p-3 text-left">Marque</th>
                                    <th className="p-3 text-left">Modèle</th>
                                    <th className="p-3 text-left">Statut</th>
                                    <th className="p-3 text-left">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {vehicules.map((vehicule) => (
                                    <tr key={vehicule.id} className="border-t">
                                        <td className="p-3 font-medium">
                                            {vehicule.immatriculation}
                                        </td>

                                        <td className="p-3">
                                            {formaterType(vehicule.type)}
                                        </td>

                                        <td className="p-3">
                                            {vehicule.marque ??
                                                "Non renseignée"}
                                        </td>

                                        <td className="p-3">
                                            {vehicule.modele ?? "Non renseigné"}
                                        </td>

                                        <td className="p-3">
                                            {formaterStatut(vehicule.statut)}
                                        </td>

                                        <td className="p-3">
                                            <div className="flex gap-3">
                                                <Link
                                                    href={`/vehicules/${vehicule.id}/edit`}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    Modifier
                                                </Link>

                                                <button
                                                    type="button"
                                                    disabled={processing}
                                                    onClick={() =>
                                                        supprimer(vehicule.id)
                                                    }
                                                    className="text-red-600 hover:underline disabled:opacity-50"
                                                >
                                                    Supprimer
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {vehicules.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="p-6 text-center text-gray-500"
                                        >
                                            Aucun véhicule enregistré pour le
                                            moment.
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
