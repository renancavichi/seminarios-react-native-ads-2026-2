using System;
using System.IO;
using UnityEditor;
using UnityEditor.Build;
using UnityEngine;

public static class ExportParaReactNative
{
    [MenuItem("React Native/Exportar Android")]
    public static void Exportar()
    {
        string destino = "C:/dev/urn/unity/export-tmp";
        bool paisagem = false;
        string[] args = Environment.GetCommandLineArgs();
        for (int i = 0; i < args.Length; i++)
        {
            if (args[i] == "-exportPath" && i + 1 < args.Length) destino = args[i + 1];
            if (args[i] == "-landscape") paisagem = true;
        }

        EditorUserBuildSettings.SwitchActiveBuildTarget(BuildTargetGroup.Android, BuildTarget.Android);

        PlayerSettings.Android.applicationEntry = AndroidApplicationEntry.Activity;
        PlayerSettings.SetScriptingBackend(NamedBuildTarget.Android, ScriptingImplementation.IL2CPP);
        PlayerSettings.Android.targetArchitectures = AndroidArchitecture.ARM64;
        PlayerSettings.SetApplicationIdentifier(NamedBuildTarget.Android, "com.anonymous.unitydemo");
        if (paisagem) PlayerSettings.defaultInterfaceOrientation = UIOrientation.LandscapeLeft;

        EditorUserBuildSettings.exportAsGoogleAndroidProject = true;

        if (Directory.Exists(destino)) Directory.Delete(destino, true);

        var opcoes = new BuildPlayerOptions
        {
            scenes = Array.FindAll(Array.ConvertAll(EditorBuildSettings.scenes, s => s.enabled ? s.path : null), p => p != null),
            locationPathName = destino,
            target = BuildTarget.Android,
            options = BuildOptions.None,
        };

        var relatorio = BuildPipeline.BuildPlayer(opcoes);
        Debug.Log("EXPORT RESULT: " + relatorio.summary.result + " -> " + destino);
        if (relatorio.summary.result != UnityEditor.Build.Reporting.BuildResult.Succeeded)
            EditorApplication.Exit(1);
    }
}
