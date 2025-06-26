import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated, Dimensions, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
    const navigation = useNavigation();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.5)).current;
    const moveAnim = useRef(new Animated.Value(0)).current;
    
    // Animation des points de chargement
    const dot1Opacity = useRef(new Animated.Value(0.3)).current;
    const dot2Opacity = useRef(new Animated.Value(0.3)).current;
    const dot3Opacity = useRef(new Animated.Value(0.3)).current;
    
    // Pour gérer les erreurs de chargement du logo
    const [logoError, setLogoError] = useState(false);

    // Animation des points de chargement
    useEffect(() => {
        const animateDots = () => {
            Animated.sequence([
                // Premier point
                Animated.timing(dot1Opacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                // Deuxième point
                Animated.timing(dot2Opacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                // Troisième point
                Animated.timing(dot3Opacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                // Réinitialisation
                Animated.parallel([
                    Animated.timing(dot1Opacity, {
                        toValue: 0.3,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                    Animated.timing(dot2Opacity, {
                        toValue: 0.3,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                    Animated.timing(dot3Opacity, {
                        toValue: 0.3,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                ]),
            ]).start(() => {
                // Répéter l'animation en boucle
                animateDots();
            });
        };

        animateDots();
        
        // Nettoyage
        return () => {
            dot1Opacity.stopAnimation();
            dot2Opacity.stopAnimation();
            dot3Opacity.stopAnimation();
        };
    }, []);

    useEffect(() => {
        // Animation séquentielle principale
        Animated.sequence([
            // Apparition du logo avec effet de scale
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ]),
            // Légère pause
            Animated.delay(500),
            // Animation du texte qui monte
            Animated.timing(moveAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            // Pause avant de naviguer
            Animated.delay(3000),
        ]).start(() => {
            // Naviguer vers l'écran principal après l'animation
            // Décommentez cette ligne quand vous êtes prêt à implémenter la navigation
            // navigation.replace('Main');
            
            console.log("Animation terminée - Prêt à naviguer");
        });
    }, []);

    // Effet de pulsation pour le logo
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.05,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#010080" barStyle="light-content" />
            
            {/* Éléments décoratifs */}
            <View style={styles.decorCircle1} />
            <View style={styles.decorCircle2} />
            <View style={styles.decorCircle3} />
            
            {/* Logo principal animé */}
            <Animated.View 
                style={[
                    styles.logoContainer,
                    { 
                        opacity: fadeAnim,
                        transform: [
                            { scale: scaleAnim },
                            { scale: pulseAnim } // Effet de pulsation
                        ] 
                    }
                ]}
            >
                <Image 
                    source={require('../assets/logo.png')} 
                    style={styles.logo}
                    onError={() => setLogoError(true)}
                />
                {logoError && (
                    <Text style={styles.fallbackLogo}>LOGO</Text>
                )}
            </Animated.View>
            
            {/* Texte animé */}
            <Animated.View 
                style={[
                    styles.textContainer,
                    {
                        opacity: fadeAnim,
                        transform: [
                            { 
                                translateY: moveAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [20, 0]
                                }) 
                            }
                        ]
                    }
                ]}
            >
                <Text style={styles.tagline}>Pour une vie plus simple.</Text>
                <Text style={styles.subtitle}> </Text>
                
                {/* Points de chargement animés */}
                <View style={styles.loadingContainer}>
                    <Animated.View style={[styles.loadingDot, { opacity: dot1Opacity }]} />
                    <Animated.View style={[styles.loadingDot, { opacity: dot2Opacity }]} />
                    <Animated.View style={[styles.loadingDot, { opacity: dot3Opacity }]} />
                </View>
            </Animated.View>
            
            {/* Indicateur de chargement en bas */}
            <Animated.Text 
                style={[
                    styles.loadingText,
                    {
                        opacity: fadeAnim
                    }
                ]}
            >
                Chargement en cours
            </Animated.Text>
        </View>
    );
};

// Définition des styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00197f', // Bleu foncé comme couleur de fond principale
        position: 'relative',
        overflow: 'hidden',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 180,
        height: 180,
        resizeMode: 'contain',
    },
    fallbackLogo: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#E7BA06', // Jaune doré
    },
    textContainer: {
        alignItems: 'center',
    },
    tagline: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#E7BA06', // Jaune doré
        textAlign: 'center',
        letterSpacing: 1,
        marginBottom: 25,
    },
    // Animation de chargement
    loadingContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    loadingDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#E7BA06', // Jaune doré
        marginHorizontal: 5,
    },
    loadingText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        position: 'absolute',
        bottom: 40,
    },
    // Éléments décoratifs pour un design plus dynamique
    decorCircle1: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(231, 186, 6, 0.1)',
        top: -50,
        right: -50,
    },
    decorCircle2: {
        position: 'absolute',
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(231, 186, 6, 0.1)', // Jaune doré transparent
        bottom: -20,
        left: -40,
    },
    decorCircle3: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(231, 186, 6, 0.15)', // Jaune doré transparent
        bottom: 100,
        right: 40,
    },
});

export default SplashScreen;