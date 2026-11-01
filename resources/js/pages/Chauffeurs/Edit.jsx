import { Link, useForm } from '@inertiajs/react';

export default function Edit({ chauffeur }) {
    const { data, setData, put, processing, errors } = useForm({
        nom: chauffeur.nom,
        telephone: chauffeur.telephone,
        numero_permis: chauffeur.numero_permis ?? '',
    });

    function submit(e) {
        e.preventDefault();

        put(`/chauffeurs/${chauffeur.id}`);
    }

    return (
        <div>
            <h1>Modifier le chauffeur</h1>

            <Link href="/chauffeurs">Retour à la liste</Link>

            <form onSubmit={submit}>
                <div>
                    <label htmlFor="nom">Nom</label>

                    <input
                        id="nom"
                        type="text"
                        value={data.nom}
                        onChange={(e) => setData('nom', e.target.value)}
                    />

                    {errors.nom && <p>{errors.nom}</p>}
                </div>

                <div>
                    <label htmlFor="telephone">Téléphone</label>

                    <input
                        id="telephone"
                        type="text"
                        value={data.telephone}
                        onChange={(e) => setData('telephone', e.target.value)}
                    />

                    {errors.telephone && <p>{errors.telephone}</p>}
                </div>

                <div>
                    <label htmlFor="numero_permis">Numéro de permis</label>

                    <input
                        id="numero_permis"
                        type="text"
                        value={data.numero_permis}
                        onChange={(e) =>
                            setData('numero_permis', e.target.value)
                        }
                    />

                    {errors.numero_permis && <p>{errors.numero_permis}</p>}
                </div>

                <button type="submit" disabled={processing}>
                    {processing ? 'Modification...' : 'Enregistrer'}
                </button>
            </form>
        </div>
    );
}
