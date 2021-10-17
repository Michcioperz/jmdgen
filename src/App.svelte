<script lang="ts">
	import { Author, Seminar, Talk } from "./utils";
	import Wywieszka from "./Wywieszka.svelte";

	const defaultSeminar = new Seminar(0, "2021-10-07T12:15", [new Talk(
		"Reaktywny interfejs do wywieszek na seminarium Systemy Rozproszone",
		[new Author("Michał", "Sidor")],
		`<p>Szablon wywieszek na Systemy Rozproszone zawiera wiele naleciałości ze starego HTMLa i zaskakujących komentarzy. To <em>rozprasza</em> osoby przygotowujące prezentacje na seminarium.</p>\n<p>Przedstawię aplikację webową służącą do generowania wywieszek na stronę seminarium. Opiszę sposób działania frameworku Svelte.</p>`
	), new Talk()]);

	let seminar = Seminar.fromObject(JSON.parse(localStorage.getItem("savedSeminar")) || defaultSeminar);

	$: localStorage.setItem("savedSeminar", JSON.stringify(seminar));

	async function uploadJSON(event) {
		const target = event.target as HTMLInputElement;
		const file = target.files[0];
		const text = await file.text();
		const obj = JSON.parse(text);
		seminar = Seminar.fromObject(obj);
	}

	function generateJSON() {
		const json = JSON.stringify(seminar);
		downloadFile(`jmdgen-${+Date()}.json`, json, "application/json");
	}

	function generateHTML() {
		const html = document.createElement("html");
		html.lang = "pl";
		html.appendChild(document.createComment("wygenerowano przy użyciu https://jmdgen.michci.ooo"));
		const head = document.createElement("head");
			const charset = document.createElement("meta");
				charset.setAttribute("charset", "UTF-8");
			head.appendChild(charset);
			const author = document.createElement("meta");
				author.name = "Author";
				author.content = seminar.allAuthors().map(author => author.toString()).join(", ");
			head.appendChild(author);
			const title = document.createElement("title");
				title.innerText = seminar.cumulativeTitle();
			head.appendChild(title);
		html.appendChild(head);
		const body = document.getElementsByClassName("generatedBody")[0].cloneNode(true);
		html.appendChild(body);
		
		downloadFile(seminar.targetFilename(), "<!DOCTYPE html>" + html.outerHTML, "text/html");
	}

	function downloadFile(fileName: string, contents: string, mimeType: string) {
		const blob = new Blob([contents], {type: mimeType});
		const objectUrl = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = objectUrl;
		a.download = fileName;
		a.click();
	}
</script>

<main width="100%">
	<table width="100%">
		<tr>
			<td width="40%">
				<p>
					<button on:click={generateJSON}>Eksportuj JSON</button>
					<button on:click={generateHTML}>Eksportuj HTML</button>
				</p>
				<details>
					<summary>Import z JSONa</summary>
					<p>Uwaga, niszczy dane w przeglądarce</p>
					<input type="file" accept=".json|application/json" on:change={uploadJSON}>
				</details>
				<p>Aby usunąć jakiś powtarzalny element należy usunąć z niego tekst</p>
				<p>
					<label for="indexNumber">Numer kolejny seminarium (liczony od 0)</label>
					<input name="indexNumber" type="number" min="0" max="17" bind:value={seminar.indexNumber}>
				</p>
				<p>
					<label for="time">Data i godzina</label>
					<input name="time" type="datetime-local" bind:value={seminar.time}>
				</p>
				<details>
					<summary>Rzadko zmienne parametry</summary>
					<p>
						<label for="room">Sala</label>
						<input name="room" type="text" bind:value={seminar.room}>
					</p>
					<p>
						<label for="onlineUrl">Link do Zooma</label>
						<input name="onlineUrl" type="url" bind:value={seminar.onlineUrl}>
					</p>
				</details>

				{#each seminar.talks as talk, talkIdx}
				<details open={talk.uncollapsed}>
					<summary>Prezentacja {talkIdx}</summary>
					<p>
						<label for={`talk${talkIdx}title`}>Tytuł</label>
						<input name={`talk${talkIdx}title`} type="text" bind:value={talk.title}>
					</p>
					<details>
						<summary>Osoby autorskie</summary>
						{#each talk.authors as author, authorIdx}
							<p>
								<label for={`talk${talkIdx}author${authorIdx}firstName`}>Imię osoby autorskiej {authorIdx}</label>
								<input name={`talk${talkIdx}author${authorIdx}firstName`} type="text" bind:value={author.firstName}>
							</p>
							<p>
								<label for={`talk${talkIdx}author${authorIdx}lastName`}>Nazwisko osoby autorskiej {authorIdx}</label>
								<input name={`talk${talkIdx}author${authorIdx}lastName`} type="text" bind:value={author.lastName}>
							</p>
						{/each}
					</details>
					<p>
						<label for={`talk${talkIdx}description`}>Opis</label>
						<textarea name={`talk${talkIdx}description`} bind:value={talk.description}></textarea>
					</p>
					<details>
						<summary>Bibliografia</summary>
						{#each talk.citations as citation, citationIdx}
							<p>
								<label for={`talk${talkIdx}citation${citationIdx}firstName`}>Tytuł wpisu {citationIdx}</label>
								<input name={`talk${talkIdx}citation${citationIdx}firstName`} type="text" bind:value={citation.title}>
							</p>
							<p>
								<label for={`talk${talkIdx}citation${citationIdx}lastName`}>URL {citationIdx}</label>
								<input name={`talk${talkIdx}citation${citationIdx}lastName`} type="text" bind:value={citation.url}>
							</p>
						{/each}
					</details>
				</details>
				{/each}
			</td>
			<td width="*">
				<Wywieszka seminar={seminar} />
			</td>
		</tr>
	</table>
</main>

<style>
	details > *{
		padding-left: 1em;
	}
	details > summary {
		padding-left: 0;
	}
	input, textarea {
		width: 100%;
	}
	td {
		vertical-align: top;
	}
</style>