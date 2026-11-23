import { Head, Link, useForm } from "@inertiajs/react";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nom: "",
        telephone: "",
        numero_permis: "",
    });

    function submit(e) {
        e.preventDefault();
        post("/chauffeurs");
    }

    const inputClass =
        "mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

    return (
        <>
            <Head title="Ajouter un chauffeur" />

            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Ajouter un chauffeur</h1>
                    <p className="text-gray-600">
                        Enregistrer un nouveau chauffeur dans le système
                    </p>
                </div>

                <div className="max-w-2xl rounded-lg bg-white p-6 shadow">
                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="nom"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Nom complet *
                            </label>
                            <input
                                id="nom"
                                type="text"
                                value={data.nom}
                                onChange={(e) => setData("nom", e.target.value)}
                                className={inputClass}
                                required
                            />
                            {errors.nom && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.nom}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="telephone"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Téléphone
                            </label>
                            <input
                                id="telephone"
                                type="text"
                                value={data.telephone}
                                onChange={(e) =>
                                    setData("telephone", e.target.value)
                                }
                                className={inputClass}
                            />
                            {errors.telephone && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.telephone}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="numero_permis"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Numéro de permis
                            </label>
                            <input
                                id="numero_permis"
                                type="text"
                                value={data.numero_permis}
                                onChange={(e) =>
                                    setData("numero_permis", e.target.value)
                                }
                                className={inputClass}
                            />
                            {errors.numero_permis && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.numero_permis}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t pt-5">
                            <Link
                                href="/chauffeurs"
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
                                    ? "Enregistrement..."
                                    : "Enregistrer"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
