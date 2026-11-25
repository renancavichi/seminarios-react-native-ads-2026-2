using UnityEngine;

public class RNBridge : MonoBehaviour
{
    public static string NomeJogador = "Jogador";
    public static string Avatar = "";

    [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.BeforeSceneLoad)]
    static void Criar()
    {
        var go = new GameObject("RNBridge");
        go.AddComponent<RNBridge>();
        DontDestroyOnLoad(go);
    }

    public void SetJogador(string nome)
    {
        if (!string.IsNullOrWhiteSpace(nome)) NomeJogador = nome.Trim();
        Enviar("{\"tipo\":\"pronto\",\"jogador\":\"" + NomeJogador + "\"}");
    }

    public void SetAvatar(string id)
    {
        Avatar = id;
    }

    public static float TempoDePartida = 0f;

    public void SetTempo(string valor)
    {
        if (!float.TryParse(valor, System.Globalization.NumberStyles.Float,
                System.Globalization.CultureInfo.InvariantCulture, out float segundos) || segundos <= 0f)
            return;
        if (Mathf.Approximately(segundos, TempoDePartida)) return;
        TempoDePartida = segundos;

        var timer = FindFirstObjectByType<PontosTimer>();
        if (timer != null) timer.tempo = segundos;
    }

    public static void Enviar(string json)
    {
#if UNITY_ANDROID && !UNITY_EDITOR
        using (var jc = new AndroidJavaClass("com.azesmwayreactnativeunity.ReactNativeUnityViewManager"))
        {
            jc.CallStatic("sendMessageToMobileApp", json);
        }
#else
        Debug.Log("[RN] " + json);
#endif
    }
}
