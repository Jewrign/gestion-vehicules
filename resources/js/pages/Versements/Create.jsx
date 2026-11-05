import { Head, Link, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function Create({ contrats }) {
    const { data, setData, post, processing, errors } = useForm({
        contrat_id: "",
        periode_debut: "",
        periode_fin: "",
        montant_deductions: 0,
        montant_paye: 0,
    });

    const [contratSelectionne, setContratSelectionne] = useState(null);

    useEffect(() => {
        if (!data.contrat_id) {
            setContratSelectionne(null);
            setData("periode_debut", "");
            setData("periode_fin", "");
            return;
        }

        const contrat = contrats.find(
            (contrat) => String(contrat.id) === String(data.contrat_id),
        );

        setContratSelectionne(contrat ?? null);

        fetch(`/versements/prochaine-periode?contrat_id=${data.contrat_id}`, {
            headers: {
                Accept: "application/json",
            },
        })
            .then((response) => response.json())
            .then((periode) => {
                if (periode.debut && periode.fin) {
                    setData("periode_debut", periode.debut);
                    setData("periode_fin", periode.fin);
                }
            });
    }, [data.contrat_id]);

    const submit = (e) => {
        e.preventDefault();

        post("/versements");
    };

    const formatMontant = (montant) => {
        return Number(montant).toLocaleString("fr-FR") + " FCFA";
    };

    return (
        <>
            <Head title="Nouveau versement" />

            <div className="p-6">
                <div className="mb-6">
                    <Link
                        href="/versements"
                        className="text-blue-600 hover:underline"
                    >
                        ← Retour aux versements
                    </Link>

                    <h1 className="mt-3 text-2xl font-bold">
                        Nouveau versement
                    </h1>
                </div>

                <form
                    onSubmit={submit}
                    className="max-w-2xl space-y-6 rounded-lg bg-white p-6 shadow"
                >
                    {/* Contrat */}
                    <div>
                        <label className="mb-1 block font-medium">
                            Contrat
                        </label>

                        <select
                            value={data.contrat_id}
                            onChange={(e) =>
                                setData("contrat_id", e.target.value)
                            }
                            className="w-full rounded border p-2"
                        >
                            <option value="">Sélectionner un contrat</option>

                            {contrats.map((contrat) => (
                                <option key={contrat.id} value={contrat.id}>
                                    {contrat.chauffeur?.nom} —{" "}
                                    {contrat.vehicule?.immatriculation}
                                </option>
                            ))}
                        </select>

                        {errors.contrat_id && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.contrat_id}
                            </p>
                        )}
                    </div>

                    {/* Informations du contrat */}
                    {contratSelectionne && (
                        <div className="rounded-lg bg-gray-50 p-4">
                            <h2 className="mb-3 font-semibold">
                                Informations du contrat
                            </h2>

                            <div className="grid gap-3 md:grid-cols-2">
                                <div>
                                    <span className="text-sm text-gray-500">
                                        Chauffeur
                                    </span>

                                    <p className="font-medium">
                                        {contratSelectionne.chauffeur?.nom}
                                    </p>
                                </div>

                                <div>
                                    <span className="text-sm text-gray-500">
                                        Véhicule
                                    </span>

                                    <p className="font-medium">
                                        {
                                            contratSelectionne.vehicule
                                                ?.immatriculation
                                        }
                                    </p>
                                </div>

                                <div>
                                    <span className="text-sm text-gray-500">
                                        Type
                                    </span>

                                    <p className="font-medium">
                                        {contratSelectionne.vehicule?.type}
                                    </p>
                                </div>

                                <div>
                                    <span className="text-sm text-gray-500">
                                        Montant journalier
                                    </span>

                                    <p className="font-medium">
                                        {formatMontant(
                                            contratSelectionne.montant_journalier,
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <span className="text-sm text-gray-500">
                                        Fréquence
                                    </span>

                                    <p className="font-medium">
                                        {contratSelectionne.frequence}
                                    </p>
                                </div>

                                <div>
                                    <span className="text-sm text-gray-500">
                                        Jour de paiement
                                    </span>

                                    <p className="font-medium">
                                        {contratSelectionne.jour_paiement ??
                                            "Chaque jour"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Période */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block font-medium">
                                Début de la période
                            </label>

                            <p className="mb-1 text-sm text-gray-500">
                                Déterminé automatiquement
                            </p>

                            <input
                                type="date"
                                value={data.periode_debut}
                                readOnly
                                className="w-full rounded border bg-gray-100 p-2"
                            />

                            {errors.periode_debut && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.periode_debut}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block font-medium">
                                Début de la période
                            </label>

                            <p className="mb-1 text-sm text-gray-500">
                                Déterminé automatiquement
                            </p>

                            <input
                                type="date"
                                value={data.periode_fin}
                                readOnly
                                className="w-full rounded border bg-gray-100 p-2"
                            />

                            {errors.periode_fin && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.periode_fin}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Déductions */}
                    <div>
                        <label className="mb-1 block font-medium">
                            Déductions
                        </label>

                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={data.montant_deductions}
                            onChange={(e) =>
                                setData("montant_deductions", e.target.value)
                            }
                            className="w-full rounded border p-2"
                        />

                        <p className="mt-1 text-sm text-gray-500">
                            Montant à déduire du versement pour cette période.
                        </p>

                        {errors.montant_deductions && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.montant_deductions}
                            </p>
                        )}
                    </div>

                    {/* Montant payé */}
                    <div>
                        <label className="mb-1 block font-medium">
                            Montant payé
                        </label>

                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={data.montant_paye}
                            onChange={(e) =>
                                setData("montant_paye", e.target.value)
                            }
                            className="w-full rounded border p-2"
                        />

                        {errors.montant_paye && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.montant_paye}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing || !data.contrat_id}
                        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {processing
                            ? "Enregistrement..."
                            : "Créer le versement"}
                    </button>
                </form>
            </div>
        </>
    );
}
