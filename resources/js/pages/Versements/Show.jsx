import { Head, Link } from "@inertiajs/react";

export default function Show({ versement }) {
    const formatMontant = (montant) =>
        new Intl.NumberFormat("fr-FR").format(Number(montant || 0)) + " FCFA";

    const lignes = [
        {
            label: "Montant normal",
            montant: versement.montant_normal,
        },
        {
            label: "Jours non payables",
            montant: -Number(versement.montant_jours_non_payables),
        },
        {
            label: "Déductions",
            montant: -Number(versement.montant_deductions),
        },
        {
            label: "Arriéré précédent",
            montant: versement.montant_arriere,
        },
    ];

    const statutLabels = {
        en_attente: "En attente",
        partiel: "Partiellement payé",
        paye: "Payé",
    };

    return (
        <>
            <Head title="Détails du versement" />

            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Détails du versement
                        </h1>
                        <p className="text-gray-500">
                            Consultez le récapitulatif de cette période.
                        </p>
                    </div>

                    <Link
                        href="/versements"
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                    >
                        Retour
                    </Link>
                </div>

                <div className="bg-white rounded-xl border p-6 space-y-4">
                    <h2 className="font-semibold text-lg">
                        Informations générales
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Chauffeur</p>
                            <p className="font-medium">
                                {versement.contrat?.chauffeur?.nom}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Véhicule</p>
                            <p className="font-medium">
                                {versement.contrat?.vehicule?.immatriculation}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Période</p>
                            <p className="font-medium">
                                {versement.periode_debut} au{" "}
                                {versement.periode_fin}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Statut</p>
                            <p className="font-medium">
                                {statutLabels[versement.statut] ||
                                    versement.statut}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border p-6 space-y-4">
                    <h2 className="font-semibold text-lg">Détail du calcul</h2>

                    <div className="space-y-3">
                        {lignes.map((ligne) => (
                            <div
                                key={ligne.label}
                                className="flex justify-between gap-4"
                            >
                                <span className="text-gray-600">
                                    {ligne.label}
                                </span>
                                <span className="font-medium">
                                    {ligne.montant < 0 ? "- " : ""}
                                    {formatMontant(Math.abs(ligne.montant))}
                                </span>
                            </div>
                        ))}
                    </div>

                    <hr />

                    <div className="flex justify-between text-lg font-bold">
                        <span>Montant total dû</span>
                        <span>{formatMontant(versement.montant_du)}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-600">Montant payé</span>
                        <span className="font-medium text-green-700">
                            {formatMontant(versement.montant_paye)}
                        </span>
                    </div>

                    <hr />

                    <div className="flex justify-between text-lg font-bold">
                        <span>Nouvel arriéré</span>
                        <span className="text-red-600">
                            {formatMontant(versement.nouvel_arriere)}
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}
