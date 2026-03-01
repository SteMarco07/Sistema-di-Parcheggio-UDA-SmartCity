# Comandi per gestire il DB

## Esportare il DB

Per esportare il DB si utilizza il seguente comando:

```bash
       docker exec lamp_db mysqldump -u root -prootpassword smartcity  > smartcity.sql
```

Come nome del file sarebbe appropriato utilizzare `smartcity-dump.sql` se è **vuoto**; invece, se sono **presenti dei dati** al suo interno è meglio utilizzare `smartcity-load.sql` per evitare di confondere i due file.

## Importare il DB

Per importare il DB si utilizza il seguente comando:

```bash
       docker exec -i lamp_db mysql -u root -prootpassword smartcity < smartcity.sql
```

Ovviamente il nome del file da importare deve essere quello corretto, quindi `smartcity-dump.sql` se si desidera caricare un **DB vuoto** o `smartcity-load.sql` se si vuole caricare un **DB già popolato**.