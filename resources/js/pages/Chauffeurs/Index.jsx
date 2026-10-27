import { Link, useForm } from "@inertiajs/react";

export default function Index({ chauffeurs }) {
    const { delete: destroy } = useForm();

    return (
        <div>
            <h1>Chauffeurs</h1>

            <Link href="/chauffeurs/create">Ajouter un chauffeur</Link>

            <div>
                {chauffeurs.map((chauffeur) => (
                    <div key={chauffeur.id}>
                        <h2>{chauffeur.nom}</h2>

                        <p>Téléphone : {chauffeur.telephone}</p>

                        <p>
                            Permis :{" "}
                            {chauffeur.numero_permis ?? "Non renseigné"}
                        </p>

                        <Link href={`/chauffeurs/${chauffeur.id}/edit`}>
                            Modifier
                        </Link>

                        <button
                            type="button"
                            onClick={() => {
                                if (
                                    confirm(
                                        "Voulez-vous vraiment supprimer ce chauffeur ?",
                                    )
                                ) {
                                    destroy(`/chauffeurs/${chauffeur.id}`);
                                }
                            }}
                        >
                            Supprimer
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
