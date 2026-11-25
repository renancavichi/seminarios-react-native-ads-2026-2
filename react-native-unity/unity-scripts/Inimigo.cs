using UnityEngine;

public class Inimigo : MonoBehaviour
{
    public Collider chao;
    public Transform personagem;
    public Sprite inimigoIdle;
    public Sprite inimigoDead;
    public SpriteRenderer alien;

    [Header("Ajuste de Borda")]
    public float margemBorda = 1.0f;

    private MeshCollider colisor;

    void Start()
    {
        colisor = GetComponent<MeshCollider>();
    }

    public void Destroy_Respawn()
    {
        alien.sprite = inimigoDead;
        colisor.enabled = false;

        Invoke("Respawn", 0.5f);
    }

    public void Respawn()
    {
        Bounds limites = chao.bounds;

        Vector3 posicao = transform.position;
        for (int tentativa = 0; tentativa < 30; tentativa++)
        {
            float posX = Random.Range(limites.min.x + margemBorda, limites.max.x - margemBorda);
            float posZ = Random.Range(limites.min.z + margemBorda, limites.max.z - margemBorda);
            Vector3 candidata = new Vector3(posX, 1.5f, posZ);
            posicao = candidata;
            if (LugarLivre(candidata)) break;
        }

        transform.position = posicao;

        alien.sprite = inimigoIdle;
        colisor.enabled = true;
    }

    bool LugarLivre(Vector3 ponto)
    {
        Collider[] encontrados = Physics.OverlapSphere(ponto, 1.0f, ~0, QueryTriggerInteraction.Ignore);
        foreach (Collider c in encontrados)
        {
            if (c == chao || c == colisor) continue;
            string nome = c.gameObject.name.ToLower();
            if (nome.StartsWith("chao") || nome.StartsWith("teto")) continue;
            return false;
        }
        return true;
    }

    void Update()
    {
        if (personagem != null)
        {
            transform.LookAt(personagem);
            transform.Rotate(Vector3.right, 90);
        }
    }
}
