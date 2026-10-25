import Icon from "../components/Icon";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../i18n";
const pages = {
  "ueber-uns": "about",
  kontakt: "contact",
  impressum: "imprint",
  datenschutz: "privacy",
  nutzungsbedingungen: "terms",
  "versand-zahlung": "shipping",
  widerruf: "withdrawal",
  barrierefreiheit: "access",
};
const legal = {
  impressum: [
    [
      "Projektstatus",
      "Velvet Essence ist ein Portfolio-Projekt von Manuel Dinis Júnior. Über diese Website werden derzeit keine Kaufverträge geschlossen.",
    ],
    [
      "Betreiberangaben noch unvollständig",
      "Eine ladungsfähige Anschrift und eine Kontakt-E-Mail wurden noch nicht hinterlegt. Gegebenenfalls erforderliche Register- und Umsatzsteuerangaben sind ebenfalls zu ergänzen. Diese Seite ist noch kein vollständiges Impressum für eine geschäftliche Website.",
    ],
    [
      "Kontakt zum Projekt",
      "Der Entwickler ist über das unten verlinkte Portfolio erreichbar.",
    ],
  ],
  datenschutz: [
    [
      "Status dieser Datenschutzhinweise",
      "Diese Hinweise beschreiben die derzeitige Demo. Verantwortlicher, Kontakt-E-Mail, Anschrift, konkrete Aufbewahrungsfristen sowie Verträge und mögliche Drittlandübermittlungen müssen vom Betreiber ergänzt und geprüft werden. Eine vollständige Datenschutzerklärung liegt damit noch nicht vor.",
    ],
    [
      "Hosting und technische Verbindungen",
      "Die Website wird auf Render bereitgestellt. Beim Aufruf fallen technisch notwendige Verbindungsdaten wie IP-Adresse, Zeitpunkt und angefragte Ressourcen an. Der Weinkatalog wird über Google Firebase Realtime Database geladen; bei Fehlern wird eine lokal mitgelieferte Auswahl angezeigt. Produktbilder werden von den im Katalog hinterlegten externen Bildservern abgerufen. Dabei erhalten diese Anbieter technisch bedingt Verbindungsdaten.",
    ],
    [
      "Warenkorb und Sprache",
      "Der Warenkorb wird unter nevinnyShopCartData und die bewusst gewählte Sprache unter velvet-language im localStorage dieses Browsers gespeichert. Diese Daten bleiben bis zum Löschen der Website-Daten beziehungsweise zur Änderung gespeichert. Der Anwendungscode bindet keine Analyse- oder Werbetracker ein. Schriftarten werden lokal ausgeliefert.",
    ],
    [
      "Demo-Anfragen",
      "Erst beim Klick auf „Demo-Anfrage speichern“ werden Produktname, Produkt-ID und Menge an Firebase übermittelt. Eine Zahlung oder Lieferung wird nicht ausgelöst. Technische Verbindungsdaten können dabei anfallen. Bitte keine personenbezogenen Angaben in Produkt- oder Testdaten eintragen.",
    ],
    [
      "Externe Links",
      "Social-Buttons sind einfache Links, keine eingebetteten Feeds. Erst beim Öffnen eines Links besuchst du die jeweilige Plattform. Dort gelten deren eigene Datenschutzbestimmungen.",
    ],
    [
      "Rechtsgrundlagen und Rechte",
      "Die konkrete Zuordnung der Verarbeitungszwecke und Rechtsgrundlagen nach Art. 6 DSGVO ist vom Verantwortlichen zu dokumentieren. Je nach Voraussetzungen bestehen Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch sowie ein Beschwerderecht bei einer Datenschutzaufsichtsbehörde. Eine Einwilligung kann für die Zukunft widerrufen werden.",
    ],
  ],
  nutzungsbedingungen: [
    [
      "Demo-Nutzung",
      "Du kannst den Katalog durchsuchen, Filter ausprobieren und einen Warenkorb zusammenstellen. Das Speichern einer Demo-Anfrage ist keine Bestellung und begründet keinen Kaufvertrag.",
    ],
    [
      "Produktdaten",
      "Preise, Bewertungen und Produktangaben dienen der Demonstration. Aktuelle Verfügbarkeit, vollständige Lebensmittelkennzeichnung und verbindliche Verkaufsinformationen werden nicht zugesichert. Es gelten derzeit keine Verkaufs-AGB, da kein Verkauf angeboten wird.",
    ],
  ],
  "versand-zahlung": [
    [
      "Kein aktiver Versand",
      "Diese Demo bietet weder Lieferung noch Abholung an. Es werden keine Versandkosten berechnet und keine Lieferzeiten zugesagt.",
    ],
    [
      "Keine Zahlungsabwicklung",
      "Es gibt keinen Zahlungsanbieter und keine Erfassung von Zahlungsdaten. Die angezeigten Preise sind Beispieldaten. Vor einem echten Verkaufsstart sind Gesamtpreise, Grundpreise, Umsatzsteuerhinweise, Versandkosten und Lieferbedingungen zu vervollständigen.",
    ],
  ],
  widerruf: [
    [
      "Kein Kaufabschluss",
      "Da über diese Demo keine Kaufverträge abgeschlossen werden, entsteht hier kein Kauf, den du widerrufen musst. Du kannst Artikel jederzeit aus dem Warenkorb entfernen.",
    ],
    [
      "Vor einem Verkaufsstart",
      "Für einen echten Verbrauchershop müssen eine zur konkreten Geschäftstätigkeit passende Widerrufsbelehrung und das erforderliche Muster-Widerrufsformular ergänzt werden. Diese Hinweisseite ersetzt diese Unterlagen nicht.",
    ],
  ],
  barrierefreiheit: [
    [
      "Bedienung",
      "Navigation, Filter, Warenkorb und Sprachauswahl sind per Tastatur bedienbar. Sichtbare Fokusrahmen, beschriftete Bedienelemente und ein Sprunglink erleichtern die Orientierung. Texte können über die Browserfunktion vergrößert werden.",
    ],
    [
      "Bewegung",
      "Der Nach-oben-Button scrollt nach deinem Klick in etwa 2,4 Sekunden zum Seitenanfang, auch bei reduzierter Bewegung. Mit dem Mausrad, einer Berührung oder einer Taste kannst du die laufende Animation abbrechen. Automatische Animationen berücksichtigen die Systemeinstellung für reduzierte Bewegung.",
    ],
    [
      "Stand und Rückmeldung",
      "Es liegt keine unabhängige Zertifizierung oder vollständige Konformitätsprüfung vor. Produktnamen und Herkunftsangaben können in ihrer Originalsprache erscheinen. Rechtliche Detailtexte stehen derzeit auf Deutsch bereit. Melde Probleme über das Portfolio des Entwicklers.",
    ],
  ],
};
export function ContentPage({ page }) {
  const { t } = useLanguage();
  useEffect(() => {
    document.title = `${t(pages[page])} · Velvet Essence`;
  }, [page, t]);
  const key = pages[page];
  const isLegal = Boolean(legal[page]);
  return (
    <main id="main" tabIndex={-1} className={`content-page${page === "ueber-uns" ? " vineyard about-background" : ""}`}>
      <section className={`page-intro${page === "ueber-uns" ? "" : " vineyard"}`}>
        <p className="eyebrow">Velvet Essence</p>
        <h1>{t(key)}</h1>
        <p>
          {t(
            isLegal
              ? "legalNote"
              : page === "ueber-uns"
                ? "story"
                : "contactText",
          )}
        </p>
      </section>
      {isLegal && (
        <article className="legal-copy" lang="de">
          {legal[page].map(([title, body]) => (
            <section key={title}>
              <h2>{title}</h2>
              <p>{body}</p>
            </section>
          ))}
          {page === "datenschutz" && (
            <p>
              <a href="https://eur-lex.europa.eu/eli/reg/2016/679/oj?locale=de">
                Datenschutz-Grundverordnung
              </a>
            </p>
          )}
          {page === "impressum" && (
            <p>
              <a href="https://www.gesetze-im-internet.de/ddg/__5.html">
                § 5 DDG
              </a>
            </p>
          )}
        </article>
      )}
      <div className="page-actions">
        {(page === "kontakt" || isLegal) && (
          <a
            className="button"
            href="https://manueldinisjunior.de/"
            rel="noopener noreferrer"
          >
            Manuel Dinis Júnior <Icon name="external" />
          </a>
        )}
        <Link className="button button-outline" to="/weinladen">
          {t("explore")} <Icon name="external" />
        </Link>
      </div>
    </main>
  );
}
