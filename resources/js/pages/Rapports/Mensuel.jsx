import { Head } from "@inertiajs/react";

export default function Mensuel({ rapport, mois, annee }) {
    const formatMontant = (montant) => {
        return Number(montant ?? 0).toLocaleString("fr-FR") + " FCFA";
    };

    const moisNoms = [
        "Janvier",
        "Février",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Août",
        "Septembre",
        "Octobre",
        "Novembre",
        "Décembre",
    ];

    const totauxChauffeurs = rapport.chauffeurs.reduce(
        (totaux, chauffeur) => {
            Object.keys(totaux).forEach((cle) => {
                totaux[cle] += Number(chauffeur.totaux[cle] ?? 0);
            });

            return totaux;
        },
        {
            montant_normal: 0,
            montant_jours_non_payables: 0,
            montant_deductions: 0,
            montant_net: 0,
            montant_paye: 0,
            montant_du_mois: 0,
            arriere_initial: 0,
            arriere_final: 0,
            total_depenses: 0,
            total_deduit: 0,
            total_non_deduit: 0,
        },
    );

    return (
        <>
            <Head title="Rapport mensuel" />

            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Rapport mensuel</h1>

                    <p className="text-gray-600">
                        Suivi financier des chauffeurs et des véhicules
                    </p>
                </div>

                {/* Filtre du rapport */}
                <form
                    method="GET"
                    action="/rapports/mensuel"
                    className="mb-6 flex flex-wrap items-end gap-4 rounded-lg bg-white p-4 shadow"
                >
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Mois
                        </label>

                        <select
                            name="mois"
                            defaultValue={mois}
                            className="rounded border-gray-300"
                        >
                            {moisNoms.map((nom, index) => (
                                <option key={index} value={index + 1}>
                                    {nom}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Année
                        </label>

                        <input
                            type="number"
                            name="annee"
                            defaultValue={annee}
                            min="2000"
                            max="2100"
                            className="w-28 rounded border-gray-300"
                        />
                    </div>

                    <button
                        type="submit"
                        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        Générer le rapport
                    </button>
                </form>

                <h2 className="mb-4 text-xl font-semibold">
                    Synthèse de {moisNoms[mois - 1]} {annee}
                </h2>

                {/* Indicateurs financiers */}
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg bg-white p-4 shadow">
                        <p className="text-sm text-gray-500">Montant normal</p>
                        <p className="mt-2 text-xl font-bold">
                            {formatMontant(totauxChauffeurs.montant_normal)}
                        </p>
                    </div>

                    <div className="rounded-lg bg-white p-4 shadow">
                        <p className="text-sm text-gray-500">Montant net</p>
                        <p className="mt-2 text-xl font-bold text-blue-600">
                            {formatMontant(totauxChauffeurs.montant_net)}
                        </p>
                    </div>

                    <div className="rounded-lg bg-white p-4 shadow">
                        <p className="text-sm text-gray-500">Montant payé</p>
                        <p className="mt-2 text-xl font-bold text-green-600">
                            {formatMontant(totauxChauffeurs.montant_paye)}
                        </p>
                    </div>

                    <div className="rounded-lg bg-white p-4 shadow">
                        <p className="text-sm text-gray-500">Arriérés finaux</p>
                        <p className="mt-2 text-xl font-bold text-red-600">
                            {formatMontant(totauxChauffeurs.arriere_final)}
                        </p>
                    </div>
                </div>

                {/* Synthèse des dépenses */}
                <div className="mb-8 rounded-lg bg-white p-5 shadow">
                    <h2 className="mb-4 text-lg font-semibold">
                        Synthèse des dépenses
                    </h2>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                            <p className="text-sm text-gray-500">
                                Total des dépenses
                            </p>
                            <p className="font-semibold">
                                {formatMontant(totauxChauffeurs.total_depenses)}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Dépenses déduites
                            </p>
                            <p className="font-semibold text-green-600">
                                {formatMontant(totauxChauffeurs.total_deduit)}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Dépenses non déduites
                            </p>
                            <p className="font-semibold text-orange-600">
                                {formatMontant(
                                    totauxChauffeurs.total_non_deduit,
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Rapports par chauffeur */}
                <h2 className="mb-4 text-xl font-semibold">
                    Détails par chauffeur
                </h2>

                <div className="space-y-6">
                    {rapport.chauffeurs.map((chauffeur) => (
                        <div
                            key={chauffeur.chauffeur_id}
                            className="overflow-hidden rounded-lg bg-white shadow"
                        >
                            <div className="border-b bg-gray-50 p-4">
                                <h3 className="text-lg font-bold">
                                    {chauffeur.chauffeur}
                                </h3>

                                <p className="text-sm text-gray-500">
                                    {chauffeur.nombre_contrats} contrat(s)
                                </p>
                            </div>

                            <div className="overflow-x-auto p-4">
                                <table className="w-full min-w-[900px] text-sm">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="p-3 text-left">
                                                Véhicule
                                            </th>
                                            <th className="p-3 text-left">
                                                Montant normal
                                            </th>
                                            <th className="p-3 text-left">
                                                Jours non payables
                                            </th>
                                            <th className="p-3 text-left">
                                                Déductions
                                            </th>
                                            <th className="p-3 text-left">
                                                Montant net
                                            </th>
                                            <th className="p-3 text-left">
                                                Montant payé
                                            </th>
                                            <th className="p-3 text-left">
                                                Arriéré final
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {chauffeur.contrats.map((contrat) => (
                                            <tr
                                                key={contrat.contrat_id}
                                                className="border-t"
                                            >
                                                <td className="p-3 font-medium">
                                                    {contrat.vehicule}
                                                </td>

                                                <td className="p-3">
                                                    {formatMontant(
                                                        contrat.montant_normal,
                                                    )}
                                                </td>

                                                <td className="p-3">
                                                    {formatMontant(
                                                        contrat.montant_jours_non_payables,
                                                    )}
                                                </td>

                                                <td className="p-3">
                                                    {formatMontant(
                                                        contrat.montant_deductions,
                                                    )}
                                                </td>

                                                <td className="p-3 font-medium">
                                                    {formatMontant(
                                                        contrat.montant_net,
                                                    )}
                                                </td>

                                                <td className="p-3">
                                                    {formatMontant(
                                                        contrat.montant_paye,
                                                    )}
                                                </td>

                                                <td className="p-3">
                                                    {formatMontant(
                                                        contrat.arriere_final,
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="grid grid-cols-1 gap-4 border-t p-4 sm:grid-cols-3">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Dépenses totales
                                    </p>
                                    <p className="font-semibold">
                                        {formatMontant(
                                            chauffeur.totaux.total_depenses,
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Dépenses déduites
                                    </p>
                                    <p className="font-semibold">
                                        {formatMontant(
                                            chauffeur.totaux.total_deduit,
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Dépenses non déduites
                                    </p>
                                    <p className="font-semibold">
                                        {formatMontant(
                                            chauffeur.totaux.total_non_deduit,
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {rapport.chauffeurs.length === 0 && (
                        <div className="rounded-lg bg-white p-6 text-center text-gray-500 shadow">
                            Aucun rapport disponible pour cette période.
                        </div>
                    )}
                </div>

                {/* Anomalies */}
                <div className="mt-8 space-y-6">
                    {/* Dépenses non attribuées */}
                    <div className="rounded-lg bg-white p-5 shadow">
                        <h2 className="mb-4 text-lg font-semibold">
                            Dépenses non attribuées (
                            {rapport.depenses_non_attribuees.length})
                        </h2>

                        {rapport.depenses_non_attribuees.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[700px] text-sm">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="p-3 text-left">
                                                Véhicule
                                            </th>
                                            <th className="p-3 text-left">
                                                Date
                                            </th>
                                            <th className="p-3 text-left">
                                                Type
                                            </th>
                                            <th className="p-3 text-left">
                                                Description
                                            </th>
                                            <th className="p-3 text-left">
                                                Montant
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {rapport.depenses_non_attribuees.map(
                                            (depense) => (
                                                <tr
                                                    key={depense.depense_id}
                                                    className="border-t"
                                                >
                                                    <td className="p-3">
                                                        {depense.vehicule ??
                                                            "Inconnu"}
                                                    </td>
                                                    <td className="p-3">
                                                        {depense.date}
                                                    </td>
                                                    <td className="p-3">
                                                        {depense.type}
                                                    </td>
                                                    <td className="p-3">
                                                        {depense.description ||
                                                            "—"}
                                                    </td>
                                                    <td className="p-3 font-medium">
                                                        {formatMontant(
                                                            depense.montant,
                                                        )}
                                                    </td>
                                                </tr>
                                            ),
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-sm text-green-600">
                                Aucune dépense non attribuée.
                            </p>
                        )}
                    </div>

                    {/* Dépenses ambiguës */}
                    <div className="rounded-lg bg-white p-5 shadow">
                        <h2 className="mb-4 text-lg font-semibold">
                            Dépenses ambiguës (
                            {rapport.depenses_ambigues.length})
                        </h2>

                        {rapport.depenses_ambigues.length > 0 ? (
                            <div className="space-y-4">
                                {rapport.depenses_ambigues.map((depense) => (
                                    <div
                                        key={depense.depense_id}
                                        className="rounded border p-4"
                                    >
                                        <p>
                                            <strong>Véhicule :</strong>{" "}
                                            {depense.vehicule ?? "Inconnu"}
                                        </p>

                                        <p>
                                            <strong>Date :</strong>{" "}
                                            {depense.date}
                                        </p>

                                        <p>
                                            <strong>Type :</strong>{" "}
                                            {depense.type}
                                        </p>

                                        <p>
                                            <strong>Description :</strong>{" "}
                                            {depense.description || "—"}
                                        </p>

                                        <p>
                                            <strong>Montant :</strong>{" "}
                                            {formatMontant(depense.montant)}
                                        </p>

                                        <p className="mt-3 font-medium">
                                            Plusieurs contrats correspondent à
                                            cette date :
                                        </p>

                                        <ul className="mt-2 list-inside list-disc text-sm">
                                            {depense.contrats.map((contrat) => (
                                                <li key={contrat.id}>
                                                    Contrat #{contrat.id} —{" "}
                                                    {contrat.chauffeur}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-green-600">
                                Aucune dépense ambiguë.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
