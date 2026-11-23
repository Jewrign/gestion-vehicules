import { Head, Link, useForm } from "@inertiajs/react";

export default function Edit({ vehicule }) {
    const { data, setData, put, processing, errors } = useForm({
        immatriculation: vehicule.immatriculation,
        type: vehicule.type,
        marque: vehicule.marque ?? "",
        modele: vehicule.modele ?? "",
        statut: vehicule.statut,
    });

    function handleSubmit(e) {
        e.preventDefault();
        put(`/vehicules/${vehicule.id}`);
    }

    const inputClass =
        "mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

    return (
        <>
            <Head title="Modifier un véhicule" />

            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Modifier le véhicule</h1>
                    <p className="text-gray-600">
                        Modifier les informations du véhicule{" "}
                        {vehicule.immatriculation}
                    </p>
                </div>

                <div className="max-w-2xl rounded-lg bg-white p-6 shadow">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="immatriculation"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Immatriculation *
                            </label>
                            <input
                                id="immatriculation"
                                type="text"
                                value={data.immatriculation}
                                onChange={(e) =>
                                    setData("immatriculation", e.target.value)
                                }
                                className={inputClass}
                                required
                            />
                            {errors.immatriculation && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.immatriculation}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="type"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Type *
                            </label>
                            <select
                                id="type"
                                value={data.type}
                                onChange={(e) =>
                                    setData("type", e.target.value)
                                }
                                className={inputClass}
                                required
                            >
                                <option value="moto">Moto</option>
                                <option value="voiture">Voiture</option>
                                <option value="car">Car / Minibus</option>
                            </select>
                            {errors.type && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.type}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="marque"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Marque
                            </label>
                            <input
                                id="marque"
                                type="text"
                                value={data.marque}
                                onChange={(e) =>
                                    setData("marque", e.target.value)
                                }
                                className={inputClass}
                            />
                            {errors.marque && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.marque}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="modele"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Modèle
                            </label>
                            <input
                                id="modele"
                                type="text"
                                value={data.modele}
                                onChange={(e) =>
                                    setData("modele", e.target.value)
                                }
                                className={inputClass}
                            />
                            {errors.modele && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.modele}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="statut"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Statut
                            </label>
                            <select
                                id="statut"
                                value={data.statut}
                                onChange={(e) =>
                                    setData("statut", e.target.value)
                                }
                                className={inputClass}
                            >
                                <option value="actif">Actif</option>
                                <option value="immobilise">Immobilisé</option>
                                <option value="inactif">Inactif</option>
                            </select>
                            {errors.statut && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.statut}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t pt-5">
                            <Link
                                href="/vehicules"
                                className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                            >
                                Annuler
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                {processing
                                    ? "Modification..."
                                    : "Enregistrer les modifications"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
