# Tímbrame WS

Microservicio encargado de mediar el _handshake_ cuando dos personas se llaman.

# Setup

Correr el _setup_ (solo necesario una sola vez):

```bash
npx dotenv-vault@latest new vlt_e9cb7eee75a7a5797724094633a8062ae5132946cdc7770683fac473f83a9a19
```

Obtener la última copia del `.env`:

```bash
npx dotenv-vault@latest pull
```

Si se realizan cambios el `.env`, pushear los cambios así:

```bash
npx dotenv-vault@latest push
```

Finalmente, correr con:

```bash
yarn dev
```
