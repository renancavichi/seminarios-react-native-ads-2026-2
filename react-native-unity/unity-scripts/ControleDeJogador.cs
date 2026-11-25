using System.Collections;
using System.Collections.Generic;
using Unity.VisualScripting;
using UnityEngine;

public class ControleDoJogador : MonoBehaviour
{
    public float sensibilidadeMouse = 100f;
    public Transform jogador;
    float rotacaoX = 0f;

    public CharacterController controller;
    public float velocidade = 4.0f;
    public float gravidade = -9.81f;
    Vector3 aceleracao;

    public GameObject arma;

    public float sensibilidadeToque = 0.15f;
    int dedoMover = -1, dedoMirar = -1;
    Vector2 inicioMover, inicioMirar, entradaMover;
    float tempoInicioMirar;

    void Start()
    {
        if (!Application.isMobilePlatform)
            Cursor.lockState = CursorLockMode.Locked;
    }
    void Update()
    {
        Arma scriptArma = GameObject.Find("Gun").GetComponent<Arma>();

        float mouseX = 0f, mouseY = 0f, x = 0f, z = 0f;
        bool atirar = false;
        if (Input.touchCount > 0)
        {
            LerToques(ref mouseX, ref mouseY, ref atirar);
            x = entradaMover.x;
            z = entradaMover.y;
        }
        else if (!Application.isMobilePlatform)
        {
            mouseX = Input.GetAxis("Mouse X") * sensibilidadeMouse * Time.deltaTime;
            mouseY = Input.GetAxis("Mouse Y") * sensibilidadeMouse * Time.deltaTime;
            x = Input.GetAxis("Horizontal");
            z = Input.GetAxis("Vertical");
            atirar = Input.GetMouseButtonDown(0);
        }

        rotacaoX -= mouseY;
        rotacaoX = Mathf.Clamp(rotacaoX, -90f, 90f);

        transform.localRotation = Quaternion.Euler(rotacaoX, 0f, 0f);
        jogador.Rotate(Vector3.up * mouseX);

        Vector3 move = transform.right * x + transform.forward * z;
        controller.Move(move * velocidade * Time.deltaTime);

        aceleracao.y += gravidade * Time.deltaTime;
        controller.Move(aceleracao * Time.deltaTime);

        if (atirar)
        {
            scriptArma.Atira();

            Vector3 origem = transform.position;
            Vector3 direcao = transform.forward;
            Ray ray = new Ray(origem, direcao);

            RaycastHit informacao;
            bool hit = Physics.Raycast(ray, out informacao);

            if (hit && informacao.collider.CompareTag("Enemy"))
            {
                Inimigo script = informacao.collider.gameObject.GetComponent<Inimigo>();
                script.Destroy_Respawn();

                PontosTimer scriptPontos = GameObject.Find("Canvas").GetComponent <PontosTimer>();
                scriptPontos.AumentaPontuacao();
            }
        }
    }

    void LerToques(ref float olharX, ref float olharY, ref bool atirar)
    {
        float raio = Screen.height * 0.12f;
        for (int i = 0; i < Input.touchCount; i++)
        {
            Touch t = Input.GetTouch(i);
            bool esquerda = t.position.x < Screen.width * 0.5f;

            if (t.phase == TouchPhase.Began)
            {
                if (esquerda && dedoMover == -1) { dedoMover = t.fingerId; inicioMover = t.position; }
                else if (!esquerda && dedoMirar == -1) { dedoMirar = t.fingerId; inicioMirar = t.position; tempoInicioMirar = Time.time; }
            }

            if (t.fingerId == dedoMover)
            {
                entradaMover = Vector2.ClampMagnitude(t.position - inicioMover, raio) / raio;
                if (t.phase == TouchPhase.Ended || t.phase == TouchPhase.Canceled) { dedoMover = -1; entradaMover = Vector2.zero; }
            }
            else if (t.fingerId == dedoMirar)
            {
                if (t.phase == TouchPhase.Moved)
                {
                    olharX += t.deltaPosition.x * sensibilidadeToque;
                    olharY += t.deltaPosition.y * sensibilidadeToque;
                }
                if (t.phase == TouchPhase.Ended || t.phase == TouchPhase.Canceled)
                {
                    bool rapido = Time.time - tempoInicioMirar < 0.25f && (t.position - inicioMirar).magnitude < Screen.dpi * 0.15f;
                    if (rapido) atirar = true;
                    dedoMirar = -1;
                }
            }
        }
    }
}
