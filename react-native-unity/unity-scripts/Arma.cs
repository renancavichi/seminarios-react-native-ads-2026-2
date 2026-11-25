using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Arma : MonoBehaviour
{
    Image arma;
    public Sprite novoSprite;
    public Sprite antigoSprite;

    void Start()
    {
        arma = GameObject.Find("Gun").GetComponent<Image>();
    }

    public void Atira()
    {
        arma.sprite = novoSprite;

        StartCoroutine(VoltaSpriteDepoisDe(0.1f));
    }

    private IEnumerator VoltaSpriteDepoisDe(float tempo)

    {
        yield return new WaitForSeconds(tempo);

        arma.sprite = antigoSprite;
    }
}
