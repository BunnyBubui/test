const HeaderTitle = ({ title, hideLogo = false }) => {
    return (
        <>
            <h1 color="black">{title}</h1>

            {!hideLogo && (
                <div className="header-page-logo">
                    <img src="pictures/01 Logo PraduGames 2025-01.png" alt="" />
                </div>
            )}
        </>
    )
}

export default HeaderTitle;