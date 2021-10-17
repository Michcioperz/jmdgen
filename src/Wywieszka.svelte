<script lang="ts">
    import type { Author, Seminar, Talk } from "./utils";
    export let seminar: Seminar;
</script>

<body class="generatedBody" bgcolor={seminar.bgColor()}>
    <p>
        <br />
        Seminarium: Systemy Rozproszone
        <br />
        <data>{seminar.date().toLocaleDateString("pl")}</data>, godzina {seminar.date().toLocaleTimeString("pl")}{#if seminar.room}, sala {seminar.room}{/if}{#if seminar.onlineUrl}, <a href={seminar.onlineUrl}>transmisja online</a>{/if}
        <br />

        {#each seminar.allAuthors() as author, i}{#if i > 0}, {/if}<autor><imie>{author.firstName}</imie> <nazwisko>{author.lastName}</nazwisko></autor>{/each}
    </p>
    {#each seminar.realTalks() as talk}
    <br />
    <br />

    <h1 align="center">{talk.title}</h1>

    <br /><br />

    {@html talk.description}

    <p>
        Zapraszam{#if talk.realAuthors().length > 1}y{/if},
        {#each talk.realAuthors() as author}
            <br /><i>{author.firstName} {author.lastName}</i>
        {/each}
    </p>

    {#if talk.realCitations().length > 0}
    <br /><br />

    <p>Bibliografia:</p>
    <ul>
        {#each talk.realCitations() as citation}
        <li>
            {#if citation.url}
            <a href={citation.url}>{citation.title}</a>
            {:else}
            {citation.title}
            {/if}
        </li>
        {/each}
    </ul>
    {/if}

    <br /><br />
    {/each}
</body>
