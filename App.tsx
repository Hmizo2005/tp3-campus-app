import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

type Evenement = {
  id: string;
  titre: string;
  categorie: string;
  capacite: number;
  inscrits: number;
};

const evenements: Evenement[] = [
  { id: 'E01', titre: 'Atelier React', categorie: 'Atelier', capacite: 25, inscrits: 25 },
  { id: 'E02', titre: 'Conference IA', categorie: 'Conference', capacite: 70, inscrits: 52 },
  { id: 'E03', titre: 'Securite mobile', categorie: 'Atelier', capacite: 20, inscrits: 17 },
  { id: 'E04', titre: 'Design UI', categorie: 'Atelier', capacite: 18, inscrits: 9 },
  { id: 'E05', titre: 'Forum projets', categorie: 'Rencontre', capacite: 50, inscrits: 49 },
  { id: 'E06', titre: 'Decouverte Git', categorie: 'Atelier', capacite: 24, inscrits: 24 },
];

function placesRestantes(e: Evenement) {
  return Math.max(0, e.capacite - e.inscrits);
}

function statutEvenement(e: Evenement) {
  const r = placesRestantes(e);
  if (r === 0) return 'Complet';
  if (r <= 3) return 'Presque complet';
  return 'Ouvert';
}

type BadgeProps = { statut: string };

function BadgeEtat({ statut }: BadgeProps) {
  let styleCouleur = styles.badgeOuvert;
  if (statut === 'Complet') styleCouleur = styles.badgeComplet;
  if (statut === 'Presque complet') styleCouleur = styles.badgePresque;
  return (
    <View style={[styles.badge, styleCouleur]}>
      <Text style={styles.texteBadge}>{statut}</Text>
    </View>
  );
}

type StatProps = { libelle: string; valeur: number };

function BlocStatistique({ libelle, valeur }: StatProps) {
  return (
    <View style={styles.blocStat}>
      <Text style={styles.valeurStat}>{valeur}</Text>
      <Text style={styles.libelleStat}>{libelle}</Text>
    </View>
  );
}

type CarteProps = { evenement: Evenement };

function CarteEvenement({ evenement }: CarteProps) {
  const rest = placesRestantes(evenement);
  const statut = statutEvenement(evenement);
  return (
    <View style={styles.carte}>
      <View style={styles.ligneHaut}>
        <Text style={styles.titreCarte}>{evenement.titre}</Text>
        <BadgeEtat statut={statut} />
      </View>
      <Text style={styles.infoCarte}>Categorie : {evenement.categorie}</Text>
      <Text style={styles.infoCarte}>Places restantes : {rest}</Text>
    </View>
  );
}

export default function App() {
  const mode = 'tous';

  const totalEvenements = evenements.length;
  const nbComplets = evenements.filter(e => placesRestantes(e) === 0).length;
  const nbAvecPlaces = evenements.filter(e => placesRestantes(e) > 0).length;
  const totalPlacesLibres = evenements.reduce((s, e) => s + placesRestantes(e), 0);

  const ateliersDispo = evenements.filter(
    e => e.categorie === 'Atelier' && placesRestantes(e) > 0
  );
  const listeAffichee = mode === 'tous' ? evenements : ateliersDispo;

  return (
    <View style={styles.page}>
      <Text style={styles.titre}>Campus Agenda</Text>
      <Text style={styles.sousTitre}>Evenements du campus - IAIL S5</Text>
      <View style={styles.grilleStats}>
        <BlocStatistique libelle="Total evenements" valeur={totalEvenements} />
        <BlocStatistique libelle="Complets" valeur={nbComplets} />
        <BlocStatistique libelle="Avec places" valeur={nbAvecPlaces} />
        <BlocStatistique libelle="Places restantes" valeur={totalPlacesLibres} />
      </View>
      <Text style={styles.titreMode}>
        {mode === 'tous' ? 'Mode affiche : Tous les evenements' : 'Mode affiche : Ateliers disponibles'}
      </Text>
      <FlatList
        data={listeAffichee}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <CarteEvenement evenement={item} />}
        ListEmptyComponent={<Text style={styles.vide}>Aucun evenement a afficher pour ce mode.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, paddingTop: 50, paddingHorizontal: 16, backgroundColor: 'aliceblue' },
  titre: { fontSize: 25, fontWeight: 'bold', color: 'navy' },
  sousTitre: { fontSize: 14, color: 'dimgray', marginBottom: 14 },
  grilleStats: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 12 },
  blocStat: { width: '48%', backgroundColor: 'lavender', padding: 10, borderRadius: 10, marginBottom: 8 },
  valeurStat: { fontSize: 19, fontWeight: 'bold', color: 'navy' },
  libelleStat: { fontSize: 12, color: 'darkslateblue' },
  titreMode: { fontSize: 15, fontWeight: 'bold', color: 'navy', marginBottom: 10 },
  carte: { backgroundColor: 'white', padding: 14, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: 'gainsboro' },
  ligneHaut: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  titreCarte: { fontSize: 16, fontWeight: 'bold', color: 'navy', flexShrink: 1 },
  infoCarte: { fontSize: 13, color: 'darkslategray', marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginLeft: 8 },
  badgeComplet: { backgroundColor: 'mistyrose' },
  badgePresque: { backgroundColor: 'moccasin' },
  badgeOuvert: { backgroundColor: 'honeydew' },
  texteBadge: { fontSize: 11, fontWeight: 'bold', color: 'navy' },
  vide: { textAlign: 'center', marginTop: 25, fontSize: 14, color: 'gray' }
});