import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  SafeAreaView,
  ScrollView,
  Platform,
  StatusBar as RNStatusBar,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import SignatureScreen from 'react-native-signature-canvas';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';

// Mantem os controles nativos fora da WebView e deixa apenas a area de desenho visivel.
const WEB_STYLE = `
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
  }
  html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: #ffffff;
    touch-action: none;
    overscroll-behavior: none;
  }
  .m-signature-pad {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    border: none !important;
    box-shadow: none !important;
    background-color: #ffffff;
  }
  .m-signature-pad--body {
    position: absolute;
    top: 0 !important;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
    width: 100% !important;
    height: 100% !important;
    border: none !important;
    margin: 0 !important;
  }

  .m-signature-pad--body::before {
    content: "✕";
    position: absolute;
    left: 20px;
    bottom: 22px;
    font-size: 16px;
    font-weight: 700;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #94a3b8;
    z-index: 3;
    pointer-events: none;
    line-height: 1;
  }

  .m-signature-pad--body::after {
    content: "";
    position: absolute;
    left: 44px;
    right: 20px;
    bottom: 26px;
    border-bottom: 2px dashed #cbd5e1;
    z-index: 3;
    pointer-events: none;
  }
  .m-signature-pad--body canvas {
    position: absolute;
    left: 0;
    top: 0;
    width: 100% !important;
    height: 100% !important;
    border-radius: 0px !important;
    box-shadow: none !important;
    touch-action: none;
    z-index: 2;
  }
  .m-signature-pad--footer {
    display: none !important;
    height: 0 !important;
    margin: 0 !important;
  }
`;

export default function App() {
  const signatureRef = useRef(null);

  const [signatureHistory, setSignatureHistory] = useState([]);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedType, setCopiedType] = useState(null); // 'json' | 'base64' | null

  const [auditPayload, setAuditPayload] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  // O atraso permite que a WebView finalize o layout antes de receber o canvas.
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const handleBegin = () => {
    setScrollEnabled(false);
    setIsDrawing(true);
  };

  const handleEnd = () => {
    setScrollEnabled(true);
    setIsDrawing(false);
    setStrokeCount((prev) => prev + 1);
  };

  const handleClear = () => {
    signatureRef.current?.clearSignature();
    setStrokeCount(0);
    setAuditPayload(null);
    setCopiedType(null);
    setIsProcessing(false);
  };

  const handleUndo = () => {
    if (strokeCount <= 0 || isProcessing) {
      return;
    }
    signatureRef.current?.undo();
    setStrokeCount((prev) => Math.max(0, prev - 1));
  };

  const handleConfirmPress = () => {
    if (strokeCount === 0) {
      handleEmpty();
      return;
    }
    setIsProcessing(true);
    signatureRef.current?.readSignature();
  };

  const handleEmpty = () => {
    setIsProcessing(false);
    Alert.alert(
      'Assinatura Vazia',
      'Por favor, faça sua assinatura antes de confirmar.',
      [{ text: 'Entendido', style: 'default' }]
    );
  };

  const handleOK = (base64Signature) => {
    // Limita registros feitos por um toque acidental sem percurso suficiente.
    if (!base64Signature || base64Signature.length < 3000) {
      setIsProcessing(false);
      Alert.alert(
        'Assinatura Inválida',
        'Assinatura muito curta. Por favor, refaça sua assinatura.',
        [{ text: 'Entendido', style: 'default' }]
      );
      return;
    }

    const os = Platform.OS;
    const timestamp = new Date().toISOString();

    const cleanBase64 = base64Signature.replace(/^data:image\/\w+;base64,/, '');

    const padding = cleanBase64.endsWith('==') ? 2 : Number(cleanBase64.endsWith('='));
    const sizeInBytes = (cleanBase64.length * 3) / 4 - padding;
    const sizeKB = (sizeInBytes / 1024).toFixed(1);

    const payload = {
      base64: base64Signature,
      timestamp,
      os,
      id: String(Date.now()),
      strokes: strokeCount,
      sizeKB,
    };

    setAuditPayload(payload);
    setSignatureHistory((prev) => [payload, ...prev]);
    setIsProcessing(false);
    setCopiedType(null);
  };

  const handleCopyJson = async () => {
    if (!auditPayload) return;
    try {
      const jsonExport = {
        os: auditPayload.os,
        timestamp: auditPayload.timestamp,
        imageBase64: auditPayload.base64,
      };
      await Clipboard.setStringAsync(JSON.stringify(jsonExport, null, 2));
      setCopiedType('json');
      setTimeout(() => setCopiedType(null), 2500);
    } catch {
      Alert.alert('Erro', 'Não foi possível copiar os dados.');
    }
  };

  const handleCopyImage = async () => {
    const contentToCopy = auditPayload?.base64;
    if (!contentToCopy) return;
    try {
      await Clipboard.setStringAsync(contentToCopy);
      setCopiedType('base64');
      setTimeout(() => setCopiedType(null), 2500);
    } catch {
      Alert.alert('Erro', 'Não foi possível copiar a imagem em Base64.');
    }
  };

  const formatTruncatedBase64 = (base64String) => {
    if (!base64String) return '';
    if (base64String.length <= 44) return base64String;
    return `${base64String.substring(0, 36)}...${base64String.substring(
      base64String.length - 8
    )}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" backgroundColor="#0f172a" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        scrollEnabled={scrollEnabled}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* 1. CABEÇALHO (HEADER) */}
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <View style={styles.headerIconBadge}>
              <Ionicons name="create-outline" size={20} color="#818cf8" />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Assinatura Digital</Text>
            </View>
          </View>

          {/* Pílulas de Status do Canvas */}
          <View style={styles.techBadgesRow}>
            <View style={styles.techBadge}>
              <Ionicons name="layers-outline" size={12} color="#a5b4fc" />
              <Text style={styles.techBadgeText}>
                Traços: {strokeCount}
              </Text>
            </View>
            <View
              style={[
                styles.techBadge,
                isDrawing ? styles.techBadgeActive : null,
              ]}
            >
              <View
                style={[
                  styles.liveDot,
                  { backgroundColor: isDrawing ? '#38bdf8' : '#64748b' },
                ]}
              />
              <Text style={styles.techBadgeText}>
                {isDrawing ? 'Assinando...' : 'Canvas Pronto'}
              </Text>
            </View>
          </View>
        </View>

        {/* 2. CANVAS DE ASSINATURA COM FUNDO GUIADO INJETADO VIA WEBSTYLE */}
        <View style={styles.canvasCard}>
          <View style={styles.canvasCardHeader}>
            <View style={styles.canvasHeaderLabelRow}>
              <Text style={styles.canvasCardLabel}>ÁREA DE ASSINATURA</Text>
            </View>
          </View>

          <View style={styles.canvasWrapper}>
            {isMounted ? (
              <SignatureScreen
                ref={signatureRef}
                onOK={handleOK}
                onEmpty={handleEmpty}
                onBegin={handleBegin}
                onEnd={handleEnd}
                webStyle={WEB_STYLE}
                scrollable={false}
                scrollEnabled={false}
                nestedScrollEnabled={false}
                showsVerticalScrollIndicator={false}
                backgroundColor="rgb(255, 255, 255)"
                penColor="#0f172a"
                minWidth={1.2}
                maxWidth={3.2}
                dotSize={2.0}
                clearText="Limpar"
                confirmText="Confirmar"
                descriptionText="Assine Aqui"
                imageType="image/png"
                webviewProps={{
                  scrollEnabled: false,
                  bounces: false,
                  ...(Platform.OS === 'android' ? { overScrollMode: 'never' } : {}),
                  showsHorizontalScrollIndicator: false,
                  showsVerticalScrollIndicator: false,
                }}
              />
            ) : (
              <View style={styles.canvasPlaceholder}>
                <ActivityIndicator size="small" color="#4f46e5" />
                <Text style={styles.canvasPlaceholderText}>Inicializando canvas...</Text>
              </View>
            )}
          </View>
        </View>

        {/* 3. BARRA DE FERRAMENTAS (ABAIXO DO CANVAS) */}
        <View style={styles.toolbar}>
          <TouchableOpacity
            style={[styles.secondaryButton, isProcessing && styles.buttonDisabled]}
            onPress={handleClear}
            disabled={isProcessing}
            activeOpacity={0.75}
          >
            <Ionicons name="trash-outline" size={18} color="#f87171" />
            <Text style={[styles.secondaryButtonText, { color: '#fca5a5' }]}>
              Limpar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.secondaryButton,
              (strokeCount === 0 || isProcessing) && styles.buttonDisabled,
            ]}
            onPress={handleUndo}
            disabled={strokeCount === 0 || isProcessing}
            activeOpacity={0.75}
          >
            <Ionicons
              name="arrow-undo-outline"
              size={18}
              color={strokeCount > 0 && !isProcessing ? '#e2e8f0' : '#64748b'}
            />
            <Text
              style={[
                styles.secondaryButtonText,
                (strokeCount === 0 || isProcessing) && styles.buttonTextDisabled,
              ]}
            >
              Desfazer
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.primaryButton, isProcessing && styles.buttonDisabled]}
            onPress={handleConfirmPress}
            disabled={isProcessing}
            activeOpacity={0.85}
          >
            {isProcessing ? (
              <>
                <ActivityIndicator size="small" color="#ffffff" />
                <Text style={styles.primaryButtonText}>Confirmando...</Text>
              </>
            ) : (
              <>
                <Ionicons name="checkmark-circle-outline" size={19} color="#ffffff" />
                <Text style={styles.primaryButtonText}>Confirmar</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* 4. ÁREA DE RESULTADOS (ASSINATURA E DADOS COLETADOS) */}
        {auditPayload ? (
          <View style={styles.payloadCard}>
            {/* Banner de Sucesso */}
            <View style={styles.statusBanner}>
              <View style={styles.statusIconContainer}>
                <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
              </View>
              <Text style={styles.statusText}>
                Assinatura Confirmada com Sucesso
              </Text>
            </View>

            {/* Exibição em Destaque da Assinatura Coletada */}
            <View style={styles.signatureShowcaseBox}>
              <View style={styles.signatureShowcaseHeader}>
                <Text style={styles.auditMetaLabel}>ASSINATURA COLETADA</Text>
                <Text style={styles.previewCaption}>
                  PNG • {auditPayload.sizeKB} KB
                </Text>
              </View>
              <View style={styles.signatureImageContainer}>
                <Image
                  source={{ uri: auditPayload.base64 }}
                  style={styles.signatureLargeImage}
                  resizeMode="contain"
                />
              </View>
            </View>

            {/* Dados Coletados após Assinar */}
            <Text style={styles.sectionSubheading}>DADOS COLETADOS</Text>

            <View style={styles.auditGrid}>
              <View style={styles.auditMetaCard}>
                <View style={styles.auditMetaHeader}>
                  <Ionicons name="phone-portrait-outline" size={13} color="#818cf8" />
                  <Text style={styles.auditMetaLabel}>SISTEMA (OS)</Text>
                </View>
                <Text style={styles.auditMetaValue}>
                  {auditPayload.os.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.auditTimestampCard}>
              <View style={styles.auditMetaHeader}>
                <Ionicons name="time-outline" size={13} color="#34d399" />
                <Text style={styles.auditMetaLabel}>DATA E HORA DO REGISTRO</Text>
              </View>
              <Text style={styles.auditTimestampValue}>
                {auditPayload.timestamp}
              </Text>
            </View>

            {/* Imagem da assinatura em Base64 */}
            <View style={styles.base64Section}>
              <View style={styles.base64HeaderRow}>
                <Text style={styles.base64Label}>
                  IMAGEM EM BASE64
                </Text>
                <Text style={styles.base64LengthBadge}>
                  {`${auditPayload.base64.length.toLocaleString('pt-BR')} caracteres`}
                </Text>
              </View>

              <View style={styles.base64CodeBox}>
                <Text style={styles.base64CodeText} numberOfLines={1} selectable>
                  {formatTruncatedBase64(auditPayload.base64)}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.smallCopyButton,
                    copiedType === 'base64' && styles.copyButtonSuccess,
                  ]}
                  onPress={handleCopyImage}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={copiedType === 'base64' ? 'checkmark' : 'copy-outline'}
                    size={13}
                    color="#ffffff"
                  />
                  <Text style={styles.smallCopyButtonText}>
                    {copiedType === 'base64' ? 'Copiado!' : 'Copiar Base64'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Resumo dos Dados em JSON */}
            <View style={styles.jsonViewerBox}>
              <View style={styles.jsonViewerHeader}>
                <View style={styles.jsonHeaderLeft}>
                  <Ionicons name="document-text-outline" size={14} color="#a5b4fc" />
                  <Text style={styles.jsonViewerTitle}>
                    Prévia do Registro (JSON)
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.copyJsonButton,
                    copiedType === 'json' && styles.copyButtonSuccess,
                  ]}
                  onPress={handleCopyJson}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={copiedType === 'json' ? 'checkmark' : 'copy-outline'}
                    size={13}
                    color="#ffffff"
                  />
                  <Text style={styles.copyJsonButtonText}>
                    {copiedType === 'json' ? 'Copiado!' : 'Copiar Dados'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.jsonCodeContent}>
                <Text style={styles.jsonCodeSnippet}>
                  {`{\n  "os": "${auditPayload.os}",\n  "timestamp": "${auditPayload.timestamp}",\n  "imageBase64": "${formatTruncatedBase64(auditPayload.base64)}"\n}`}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.emptyPayloadCard}>
            <Ionicons
              name="information-circle-outline"
              size={22}
              color="#64748b"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.emptyPayloadText}>
              Após confirmar, o aplicativo registra nesta sessão a{' '}
              <Text style={styles.emptyPayloadHighlight}>
                imagem da assinatura, data e hora e sistema operacional
              </Text>
              .
            </Text>
          </View>
        )}

        {/* 5. HISTÓRICO DE ASSINATURAS */}
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <View style={styles.historyTitleRow}>
              <Ionicons
                name="time-outline"
                size={16}
                color="#818cf8"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.historyTitle}>
                Assinaturas Recentes
              </Text>
            </View>
            <View style={styles.historyCountBadge}>
              <Text style={styles.historyCountText}>
                {signatureHistory.length}{' '}
                {signatureHistory.length === 1 ? 'registro' : 'registros'}
              </Text>
            </View>
          </View>

          {signatureHistory.length === 0 ? (
            <View style={styles.historyEmptyContainer}>
              <Text style={styles.historyEmptyText}>
                Nenhuma assinatura registrada nesta sessão.
              </Text>
            </View>
          ) : (
            <FlatList
              data={signatureHistory}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.historyListContent}
              renderItem={({ item, index }) => {
                const isSelected = auditPayload?.id === item.id;
                const itemNumber = signatureHistory.length - index;

                return (
                  <TouchableOpacity
                    style={[
                      styles.historyCard,
                      isSelected && styles.historyCardActive,
                    ]}
                    onPress={() => {
                      setAuditPayload(item);
                      setCopiedType(null);
                    }}
                    activeOpacity={0.8}
                  >
                    <View style={styles.historyCardTopRow}>
                      <Text style={styles.historyBadgeText}>
                        #{itemNumber}
                      </Text>
                      <View style={styles.historySyncedDot} />
                    </View>

                    <View style={styles.historyThumbnailContainer}>
                      <Image
                        source={{ uri: item.base64 }}
                        style={styles.historyThumbnail}
                        resizeMode="contain"
                      />
                    </View>

                    <View style={styles.historyTimestampRow}>
                      <Ionicons
                        name="globe-outline"
                        size={10}
                        color="#94a3b8"
                        style={{ marginRight: 3 }}
                      />
                      <Text style={styles.historyTimestamp} numberOfLines={1}>
                        {item.ip}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a', // Slate 900
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },

  /* 1. CABEÇALHO */
  header: {
    marginBottom: 12,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(79, 70, 229, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 2,
    fontWeight: '500',
  },
  techBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  techBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 5,
  },
  techBadgeActive: {
    borderColor: '#38bdf8',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
  },
  techBadgeText: {
    fontSize: 11,
    color: '#cbd5e1',
    fontWeight: '600',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  /* 2. CANVAS DE ASSINATURA */
  canvasCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 12,
  },
  canvasCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  canvasHeaderLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  canvasCardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.8,
  },
  cssBadge: {
    backgroundColor: 'rgba(79, 70, 229, 0.25)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.4)',
  },
  cssBadgeText: {
    fontSize: 9,
    color: '#a5b4fc',
    fontWeight: '700',
  },
  canvasCardHint: {
    fontSize: 11,
    color: '#64748b',
    fontStyle: 'italic',
  },
  canvasWrapper: {
    height: 265,
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  canvasPlaceholder: {
    flex: 1,
    height: 265,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    gap: 8,
  },
  canvasPlaceholderText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },

  /* 3. BARRA DE FERRAMENTAS */
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    paddingVertical: 11,
    paddingHorizontal: 13,
    borderRadius: 12,
    gap: 5,
  },
  secondaryButtonText: {
    color: '#e2e8f0',
    fontSize: 13,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonTextDisabled: {
    color: '#64748b',
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4f46e5', // Indigo 600
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    gap: 6,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  /* 4. ÁREA DE RESULTADOS & AUDITORIA CORPORATIVA */
  payloadCard: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 14,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  statusIconContainer: {
    marginRight: 6,
  },
  statusText: {
    color: '#4ade80',
    fontSize: 12,
    fontWeight: '700',
  },
  signatureShowcaseBox: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 12,
  },
  signatureShowcaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  signatureImageContainer: {
    width: '100%',
    height: 110,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signatureLargeImage: {
    width: '100%',
    height: '100%',
  },
  sectionSubheading: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.7,
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  auditGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  auditMetaCard: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  auditMetaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  auditMetaLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.5,
  },
  auditMetaValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#f8fafc',
  },
  auditTimestampCard: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 10,
  },
  auditTimestampValue: {
    fontSize: 11,
    color: '#34d399',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  previewCaption: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
  },
  base64Section: {
    marginBottom: 10,
  },
  base64HeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  base64Label: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.5,
  },
  base64LengthBadge: {
    fontSize: 10,
    color: '#818cf8',
    fontWeight: '600',
  },
  base64CodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 6,
  },
  base64CodeText: {
    flex: 1,
    fontSize: 10,
    color: '#cbd5e1',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  smallCopyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4f46e5',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 6,
    gap: 3,
  },
  smallCopyButtonText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  copyButtonSuccess: {
    backgroundColor: '#16a34a',
  },
  jsonViewerBox: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
  },
  jsonViewerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  jsonHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  jsonViewerTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#cbd5e1',
  },
  copyJsonButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4f46e5',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    gap: 4,
  },
  copyJsonButtonText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  jsonCodeContent: {
    padding: 8,
  },
  jsonCodeSnippet: {
    fontSize: 11,
    color: '#a5b4fc',
    lineHeight: 16,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  emptyPayloadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 14,
  },
  emptyPayloadText: {
    flex: 1,
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 17,
  },
  emptyPayloadHighlight: {
    color: '#818cf8',
    fontWeight: '700',
  },

  /* 5. HISTÓRICO DE ASSINATURAS */
  historySection: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  historyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#f8fafc',
  },
  historyCountBadge: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  historyCountText: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
  },
  historyEmptyContainer: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyEmptyText: {
    fontSize: 12,
    color: '#64748b',
    fontStyle: 'italic',
  },
  historyListContent: {
    gap: 10,
    paddingRight: 4,
  },
  historyCard: {
    width: 148,
    backgroundColor: '#0f172a',
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  historyCardActive: {
    borderColor: '#6366f1',
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
  },
  historyCardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  historyBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#a5b4fc',
  },
  historySyncedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22c55e',
  },
  historyThumbnailContainer: {
    width: '100%',
    height: 52,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  historyThumbnail: {
    width: '100%',
    height: '100%',
  },
  historyTimestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyTimestamp: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '500',
  },
});
