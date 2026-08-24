# 100 Mano Amiga Dicen

Versión modular con Firebase Firestore y sincronización en tiempo real mediante `onSnapshot()`.

## Estructura de Firestore

La colección `preguntas` conserva exactamente:

```text
preguntas/{documentId}
  titulo: "..."
  respuestas: [
    { texto: "...", puntos: 40, revelada: false },
    ...
  ]
```

El estado en vivo del juego se guarda en `partidas/{sesion}`. Esto no modifica la estructura de `preguntas`.

## Configuración

`firebase.js` ya está configurado para el proyecto Firebase `mano-amiga-dicen`.

Serví el proyecto desde un servidor local o Vercel (los módulos ES no deben abrirse con `file://`).

Si el panel indica `permiso denegado`, revisá las reglas de Firestore. Si indica `la colección "preguntas" está VACÍA`, el proyecto está conectado correctamente pero no existen documentos directamente dentro de `preguntas`.

## URLs

Control:
`control.html?sesion=acto-17-agosto`

Pantalla:
`pantalla.html?sesion=acto-17-agosto`

Ambas URLs con la misma sesión comparten el mismo estado de Firestore.

## Atajos

- `1` a `8`: revelar/ocultar respuesta
- `X`: error
- `A`: dar pozo a Equipo A
- `B`: dar pozo a Equipo B
- `N`: siguiente pregunta
- `P`: pregunta anterior
- `R`: reiniciar ronda
- `S`: reiniciar puntajes
- `F`: pantalla completa

No se utiliza `setInterval`, polling ni consultas repetitivas. La sincronización se realiza con `onSnapshot()`.
