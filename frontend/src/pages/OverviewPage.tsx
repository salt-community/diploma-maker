export const OverviewPage = () => {
    return(
        <main>
            <header>
                <input type="text" placeholder="search" />
            </header>
            <section>
                <h2>Bootcamps</h2>
                <div>
                    <select>
                        <option value=".Net Fullstack">Dotnet</option>
                        <option value="Java Fullstack">Java</option>
                        <option value="Javascript Fullstack">JavaScript</option>
                    </select>
                </div>
            </section>
            <section>
                <div>
                    <article className="item">Li lau</article>
                    <article className="item">Luan karlsson</article>
                    <article className="item">Willy Wonka</article>
                    <article className="item">Tom Ryder</article>
                    <article className="item">Page sage</article>
                    <article className="item">Marco Pierre White</article>
                    <article className="item">Junior JR</article>
                    <article className="item">Tommy Lee</article>
                </div>
                <footer>
                    <div className="flex justify-center mt-4">
                        <button>Previous</button>
                        <span className="mx-4">
                            Page 1 of 5
                        </span>
                        <button>Next</button>
                    </div>
                </footer>
            </section>
        </main>
    )
}