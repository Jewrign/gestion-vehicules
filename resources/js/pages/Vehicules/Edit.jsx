import { Link, useForm } from '@inertiajs/react';

export default function Edit({ vehicule }) {
    const { data, setData, put, processing, errors } = useForm({
        immatriculation: vehicule.immatriculation,
        type: vehicule.type,
        marque: vehicule.marque ?? '',
        modele: vehicule.modele ?? '',
        statut: vehicule.statut,
    });

    function handleSubmit(e) {
        e.preventDefault();

        put(`/vehicules/${vehicule.id}`);
    }

    return (
        <div>
            <h1>Modifier le véhicule</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="immatriculation">Immatriculation *</label>

                    <input
                        id="immatriculation"
                        type="text"
                        value={data.immatriculation}
                        onChange={(e) =>
                            setData('immatriculation', e.target.value)
                        }
                        required
                    />

                    {errors.immatriculation && <p>{errors.immatriculation}</p>}
                </div>

                <div>
                    <label htmlFor="type">Type *</label>

                    <select
                        id="type"
                        value={data.type}
                        onChange={(e) => setData('type', e.target.value)}
                        required
                    >
                        <option value="moto">Moto</option>
                        <option value="voiture">Voiture</option>
                        <option value="car">Car / Minibus</option>
                    </select>

                    {errors.type && <p>{errors.type}</p>}
                </div>

                <div>
                    <label htmlFor="marque">Marque</label>

                    <input
                        id="marque"
                        type="text"
                        value={data.marque}
                        onChange={(e) => setData('marque', e.target.value)}
                    />

                    {errors.marque && <p>{errors.marque}</p>}
                </div>

                <div>
                    <label htmlFor="modele">Modèle</label>

                    <input
                        id="modele"
                        type="text"
                        value={data.modele}
                        onChange={(e) => setData('modele', e.target.value)}
                    />

                    {errors.modele && <p>{errors.modele}</p>}
                </div>

                <div>
                    <label htmlFor="statut">Statut</label>

                    <select
                        id="statut"
                        value={data.statut}
                        onChange={(e) => setData('statut', e.target.value)}
                    >
                        <option value="actif">Actif</option>
                        <option value="immobilise">Immobilisé</option>
                        <option value="inactif">Inactif</option>
                    </select>

                    {errors.statut && <p>{errors.statut}</p>}
                </div>

                <button type="submit" disabled={processing}>
                    {processing
                        ? 'Modification...'
                        : 'Enregistrer les modifications'}
                </button>

                <Link href="/vehicules">Annuler</Link>
            </form>
        </div>
    );
}
