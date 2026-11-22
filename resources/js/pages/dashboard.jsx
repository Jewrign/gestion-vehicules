import { Head } from "@inertiajs/react";
import {
    CarFront,
    Users,
    FileText,
    Wallet,
    Receipt,
    AlertTriangle,
    Wrench,
    ArrowUpRight,
    CalendarDays,
} from "lucide-react";

const formatMontant = (montant) =>
    new Intl.NumberFormat("fr-FR", {
        maximumFractionDigits: 0,
    }).format(Number(montant || 0)) + " FCFA";

const formatDate = (date) => {
    if (!date) return "—";

    return new Date(`${date.substring(0, 10)}T00:00:00`).toLocaleDateString(
        "fr-FR",
    );
};

const moisActuel = (mois, annee) => {
    const date = new Date(annee, mois - 1, 1);

    return date.toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
    });
};

function StatCard({ title, value, description, icon: Icon }) {
    return (
        <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                    {title}
                </p>
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <Icon className="size-5" />
                </div>
            </div>

            <p className="mt-4 text-2xl font-bold tracking-tight">{value}</p>

            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>
    );
}

function SectionTitle({ title, description }) {
    return (
        <div className="mb-4">
            <h2 className="text-lg font-semibold">{title}</h2>
            {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
            )}
        </div>
    );
}

export default function Dashboard({
    statistiques,
    documents_alerte,
    derniers_versements,
    dernieres_depenses,
    mois,
    annee,
}) {
    const stats = statistiques;

    return (
        <>
            <Head title="Tableau de bord" />

            <div className="space-y-8 p-4 md:p-6">
                {/* En-tête */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Tableau de bord
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Vue générale de votre parc automobile.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm">
                        <CalendarDays className="size-4 text-muted-foreground" />
                        <span className="capitalize">
                            {moisActuel(mois, annee)}
                        </span>
                    </div>
                </div>

                {/* Parc automobile */}
                <section>
                    <SectionTitle
                        title="Parc automobile"
                        description="État actuel de votre activité."
                    />

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <StatCard
                            title="Véhicules actifs"
                            value={stats.vehicules_actifs}
                            description="Véhicules en activité"
                            icon={CarFront}
                        />

                        <StatCard
                            title="Véhicules immobilisés"
                            value={stats.vehicules_immobilises}
                            description="Véhicules à l'arrêt"
                            icon={Wrench}
                        />

                        <StatCard
                            title="Chauffeurs actifs"
                            value={stats.chauffeurs_actifs}
                            description="Chauffeurs enregistrés comme actifs"
                            icon={Users}
                        />

                        <StatCard
                            title="Contrats en cours"
                            value={stats.contrats_actifs}
                            description="Contrats actifs à ce jour"
                            icon={FileText}
                        />
                    </div>
                </section>

                {/* Finances */}
                <section>
                    <SectionTitle
                        title="Situation financière"
                        description="Montants comptabilisés pour le mois sélectionné."
                    />

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        <StatCard
                            title="Versements comptabilisés"
                            value={formatMontant(
                                stats.versements_comptabilises,
                            )}
                            description="Montants payés répartis sur les périodes du mois"
                            icon={Wallet}
                        />

                        <StatCard
                            title="Obligations nettes"
                            value={formatMontant(stats.obligations_nettes)}
                            description="Montants nets dus pour les périodes du mois"
                            icon={ArrowUpRight}
                        />

                        <StatCard
                            title="Dépenses du mois"
                            value={formatMontant(stats.depenses_mois)}
                            description="Total des dépenses enregistrées"
                            icon={Receipt}
                        />
                    </div>
                </section>

                {/* Documents à surveiller */}
                <section>
                    <SectionTitle
                        title="Documents à surveiller"
                        description="Documents expirés ou arrivant à expiration dans les 30 jours."
                    />

                    <div className="overflow-hidden rounded-xl border bg-card">
                        {documents_alerte.length === 0 ? (
                            <div className="p-6 text-center text-sm text-muted-foreground">
                                <FileText className="mx-auto mb-2 size-8 opacity-40" />
                                Aucun document à signaler.
                            </div>
                        ) : (
                            <div className="divide-y">
                                {documents_alerte.map((document) => (
                                    <div
                                        key={document.id}
                                        className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-lg bg-amber-500/10 p-2 text-amber-600">
                                                <AlertTriangle className="size-5" />
                                            </div>

                                            <div>
                                                <p className="font-medium">
                                                    {document.type ===
                                                    "assurance"
                                                        ? "Assurance"
                                                        : "Visite technique"}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {document.immatriculation ||
                                                        "Véhicule inconnu"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="sm:text-right">
                                            <p className="text-sm font-medium">
                                                Expiration :{" "}
                                                {formatDate(
                                                    document.date_expiration,
                                                )}
                                            </p>

                                            <span
                                                className={`text-xs font-medium ${
                                                    document.expire
                                                        ? "text-red-600"
                                                        : "text-amber-600"
                                                }`}
                                            >
                                                {document.expire
                                                    ? "Document expiré"
                                                    : "Expiration prochaine"}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Activité récente */}
                <div className="grid gap-8 xl:grid-cols-2">
                    <section>
                        <SectionTitle
                            title="Derniers versements"
                            description="Les cinq derniers versements enregistrés."
                        />

                        <div className="overflow-hidden rounded-xl border bg-card">
                            {derniers_versements.length === 0 ? (
                                <p className="p-6 text-center text-sm text-muted-foreground">
                                    Aucun versement enregistré.
                                </p>
                            ) : (
                                <div className="divide-y">
                                    {derniers_versements.map((versement) => (
                                        <div key={versement.id} className="p-4">
                                            <div className="flex items-center justify-between gap-3">
                                                <div>
                                                    <p className="font-medium">
                                                        {versement.contrat
                                                            ?.chauffeur?.nom ||
                                                            "Chauffeur inconnu"}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {versement.contrat
                                                            ?.vehicule
                                                            ?.immatriculation ||
                                                            "Véhicule inconnu"}
                                                    </p>
                                                </div>

                                                <p className="font-semibold tabular-nums">
                                                    {formatMontant(
                                                        versement.montant_paye,
                                                    )}
                                                </p>
                                            </div>

                                            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                                                <span>
                                                    Période :{" "}
                                                    {formatDate(
                                                        versement.periode_debut,
                                                    )}{" "}
                                                    –{" "}
                                                    {formatDate(
                                                        versement.periode_fin,
                                                    )}
                                                </span>
                                                <span className="capitalize">
                                                    {versement.statut?.replace(
                                                        "_",
                                                        " ",
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    <section>
                        <SectionTitle
                            title="Dernières dépenses"
                            description="Les cinq dernières dépenses enregistrées."
                        />

                        <div className="overflow-hidden rounded-xl border bg-card">
                            {dernieres_depenses.length === 0 ? (
                                <p className="p-6 text-center text-sm text-muted-foreground">
                                    Aucune dépense enregistrée.
                                </p>
                            ) : (
                                <div className="divide-y">
                                    {dernieres_depenses.map((depense) => (
                                        <div key={depense.id} className="p-4">
                                            <div className="flex items-center justify-between gap-3">
                                                <div>
                                                    <p className="font-medium">
                                                        {depense.type}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {depense.vehicule
                                                            ?.immatriculation ||
                                                            "Véhicule inconnu"}
                                                    </p>
                                                </div>

                                                <p className="font-semibold tabular-nums">
                                                    {formatMontant(
                                                        depense.montant,
                                                    )}
                                                </p>
                                            </div>

                                            <div className="mt-2 flex justify-between gap-3 text-xs text-muted-foreground">
                                                <span>
                                                    {formatDate(depense.date)}
                                                </span>
                                                <span>
                                                    {depense.deductible
                                                        ? "Déductible"
                                                        : "Non déductible"}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
