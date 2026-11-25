using System;
using System.IO;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;

public static class CapturasParaMenu
{
    [MenuItem("React Native/Capturar fundos do menu")]
    public static void Capturar()
    {
        string saida = "C:/dev/urn/assets/menu/fundos";
        string[] args = Environment.GetCommandLineArgs();
        for (int i = 0; i < args.Length - 1; i++) if (args[i] == "-saida") saida = args[i + 1];
        Directory.CreateDirectory(saida);

        EditorSceneManager.OpenScene("Assets/Scenes/FPS.unity");
        Camera cam = Camera.main;
        if (cam == null) { Debug.LogError("Sem Main Camera"); EditorApplication.Exit(1); return; }

        Vector3 pos0 = cam.transform.position;
        Quaternion rot0 = cam.transform.rotation;

        Render(cam, Path.Combine(saida, "fundo-1.jpg"));
        cam.transform.rotation = rot0 * Quaternion.Euler(0, 40, 0);
        Render(cam, Path.Combine(saida, "fundo-2.jpg"));
        cam.transform.rotation = rot0 * Quaternion.Euler(0, -45, 0);
        Render(cam, Path.Combine(saida, "fundo-3.jpg"));

        cam.transform.SetPositionAndRotation(pos0, rot0);
        Debug.Log("CAPTURAS OK -> " + saida);
    }

    static void Render(Camera cam, string arquivo)
    {
        var rt = new RenderTexture(1920, 1080, 24);
        cam.targetTexture = rt;
        cam.Render();
        RenderTexture.active = rt;
        var tex = new Texture2D(1920, 1080, TextureFormat.RGB24, false);
        tex.ReadPixels(new Rect(0, 0, 1920, 1080), 0, 0);
        tex.Apply();
        File.WriteAllBytes(arquivo, tex.EncodeToJPG(90));
        cam.targetTexture = null;
        RenderTexture.active = null;
        UnityEngine.Object.DestroyImmediate(rt);
        UnityEngine.Object.DestroyImmediate(tex);
    }
}
