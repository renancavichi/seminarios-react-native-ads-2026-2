using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

public class PontosTimer : MonoBehaviour
{
    public Text pontuacao;
    private int pontos = 0;

    public Text timer;
    public float tempo = 10.0f;

    void Start()
    {
        if (RNBridge.TempoDePartida > 0f) tempo = RNBridge.TempoDePartida;
    }

    public void AumentaPontuacao()
    {
        pontos++;
        RNBridge.Enviar("{\"tipo\":\"ponto\",\"pontos\":" + pontos + "}");
    }
    void Update()
    {
        pontuacao.text = RNBridge.NomeJogador + " - Pontos: " + pontos;

        tempo -= Time.deltaTime;
        timer.text = "Tempo:" + Mathf.Max(0, Mathf.RoundToInt(tempo));

        if (tempo <= 0.0f){
            RNBridge.Enviar("{\"tipo\":\"fim\",\"pontos\":" + pontos + "}");
            SceneManager.LoadScene(SceneManager.GetActiveScene().name);
        }
    }
}
