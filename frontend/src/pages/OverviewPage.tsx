import './OverviewPage.css';

export const OverviewPage = () => {
    return(
        <main className="overview-page">
            <header className="overview-page__header input-wrapper">
                <input className="overview-page__search-input" type="text" placeholder="search" />
                <svg className='input-icon' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.9536 14.9458L21 21M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </header>
            <section className="overview-page__select">
                <h2 className="overview-page__section-title">Bootcamps</h2>
                <div className="overview-page__select-container select-wrapper">
                    <select className="overview-page__select-box">
                        <option value=".Net Fullstack">Dotnet</option>
                        <option value="Java Fullstack">Java</option>
                        <option value="Javascript Fullstack">JavaScript</option>
                    </select>
                </div>
            </section>
            <section className="overview-page__browse">
                <div className="overview-page__item-container">
                    <article className="overview-page__item">
                        <p className='overview-page__item--title'>Li lau</p>
                        <img className='overview-page__item--bg' src="https://res.cloudinary.com/dlw9fdrql/image/upload/v1718105458/diploma_xmqcfi.jpg" alt="" />
                    </article>
                    <article className="overview-page__item">
                        <p className='overview-page__item--title'>Luan karlsson</p>
                        <img className='overview-page__item--bg' src="https://res.cloudinary.com/dlw9fdrql/image/upload/v1718105458/diploma_xmqcfi.jpg" alt="" />
                    </article>
                    <article className="overview-page__item">
                        <p className='overview-page__item--title'>Willy Wonka</p>
                        <img className='overview-page__item--bg' src="https://res.cloudinary.com/dlw9fdrql/image/upload/v1718105458/diploma_xmqcfi.jpg" alt="" />
                    </article>
                    <article className="overview-page__item">
                        <p className='overview-page__item--title'>Tom Ryder</p>
                        <img className='overview-page__item--bg' src="https://res.cloudinary.com/dlw9fdrql/image/upload/v1718105458/diploma_xmqcfi.jpg" alt="" />
                    </article>
                    <article className="overview-page__item">
                        <p className='overview-page__item--title'>Page sage</p>
                        <img className='overview-page__item--bg' src="https://res.cloudinary.com/dlw9fdrql/image/upload/v1718105458/diploma_xmqcfi.jpg" alt="" />
                    </article>
                    <article className="overview-page__item">
                        <p className='overview-page__item--title'>Marco Pierre White</p>
                        <img className='overview-page__item--bg' src="https://res.cloudinary.com/dlw9fdrql/image/upload/v1718105458/diploma_xmqcfi.jpg" alt="" />
                    </article>
                    <article className="overview-page__item">
                        <p className='overview-page__item--title'>Junior JR</p>
                        <img className='overview-page__item--bg' src="https://res.cloudinary.com/dlw9fdrql/image/upload/v1718105458/diploma_xmqcfi.jpg" alt="" />
                    </article>
                    <article className="overview-page__item">
                        <p className='overview-page__item--title'>Tommy Lee</p>
                        <img className='overview-page__item--bg' src="https://res.cloudinary.com/dlw9fdrql/image/upload/v1718105458/diploma_xmqcfi.jpg" alt="" />
                    </article>
                </div>
                <footer className="overview-page__footer">
                    <button className="overview-page__pagination-button iconbtn">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 7L10 12L15 17" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <span className="overview-page__pagination-info">
                        Page 1 of 5
                    </span>
                    <button className="overview-page__pagination-button iconbtn">
                        <svg viewBox="0 0 24 24" style={{transform: 'rotate(180deg)'}} fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 7L10 12L15 17" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </footer>
            </section>
        </main>
    )
}
