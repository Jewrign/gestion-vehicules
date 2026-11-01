import { Link, useForm } from '@inertiajs/react';

export default function Index({ vehicules }) {
    const { delete: destroy, processing } = useForm();
    return (
        <div>
            <h1>Véhicules</h1>

            <Link href="/vehicules/create">Ajouter un véhicule</Link>

            <div>
                {vehicules.length === 0 ? (
                    <p>Aucun véhicule enregistré pour le moment.</p>
                ) : (
                    vehicules.map((vehicule) => (
                        <div key={vehicule.id}>
                            <h2>{vehicule.immatriculation}</h2>

                            <p>Type : {vehicule.type}</p>

                            <p>
                                Marque : {vehicule.marque ?? 'Non renseignée'}
                            </p>

                            <p>Modèle : {vehicule.modele ?? 'Non renseigné'}</p>

                            <p>Statut : {vehicule.statut}</p>

                            <Link href={`/vehicules/${vehicule.id}/edit`}>
                                Modifier
                            </Link>

                            <button
                                type="button"
                                disabled={processing}
                                onClick={() => {
                                    if (
                                        confirm(
                                            'Voulez-vous vraiment supprimer ce véhicule ?',
                                        )
                                    ) {
                                        destroy(`/vehicules/${vehicule.id}`);
                                    }
                                }}
                            >
                                Supprimer
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
