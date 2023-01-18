# Eleventy Starter Template

Punto de partida para proyectos utilizando el generador de sitios estáticos [Eleventy](https://www.11ty.dev/).

Incluye:
- Variables de entorno. Para discriminar entre desarrollo y producción.
- Optimización de CSS. Purga de estilos no utilizados y eliminación de elementos no indispensables.
- Optimización de los ficheros HTML resultantes.
- Optimización del código Javascript.

## Scripts

- En modo desarrollo: `npm run serve`
- Producción: `npm run build`

## Variables de Entorno

### Acceder desde plantilla

```
{% if meta.env == 'prod' %}
    
{% else %}
    
{% endif %}
```

### Acceder desde `.eleventy.js`

```
if (process.env.ELEVENTY_ENV !== "prod") {}
```

## CSS
Añadir y eliminar ficheros CSS.
- Carpeta: /src/_includes/css/
- Modificar cabecera: /src/_includes/head.njk

## JS
Los ficheros javascript se pueden insertar en cualquier punto de plantilla, y se insertan _inline_.
Se añade el filtro `jsmin` para minificarlo utilizando _terser_ si está en producción.

```
{% set js %}
  {% include "./_includes/js/scripts.js" %}
{% endset %}

<script>
    {% if  meta.env == 'prod'  %}
        {{ js | jsmin | safe }}
    {% else %}
        {{ js | safe }}
    {% endif %}
</script>
```
