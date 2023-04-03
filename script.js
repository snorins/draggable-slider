const actionMovieContainer = document.querySelector('.card-container.action-movies');
const tvShowContainer = document.querySelector('.card-container.tv-shows');

let mouseDown = false;

let mouseDownLastPositionXActionMovies = 0;
let actionMoviesContainerTransformX = 0;
let mouseMoveLastXPositionActionMovies = 0;

let mouseDownLastPositionXTvShows = 0;
let tvShowsContainerTransformX = 0;
let mouseMoveLastXPositionTvShows = 0;

window.addEventListener('resize', () => handleDrag());

const handleGestureDown = (event, cardContainer) => {
    mouseDown = true;

    const cardContainerType = cardContainer.classList[1];
    const container = cardContainerType === 'action-movies' ? actionMovieContainer : tvShowContainer;

    if (cardContainerType === 'action-movies') {
        mouseDownLastPositionXActionMovies = event.pageX;
    } else {
        mouseDownLastPositionXTvShows = event.pageX;
    }

    const cardContainerTransform = window.getComputedStyle(container).getPropertyValue('transform');
    if (cardContainerTransform !== 'none') {
        const containerTransformX = parseInt(cardContainerTransform.split(',')[4].trim());

        if (cardContainerType === 'action-movies') {
            actionMoviesContainerTransformX = containerTransformX;
        } else {
            tvShowsContainerTransformX = containerTransformX;
        }
    }
};

const handleGestureMove = (event, cardContainer) => {
    const cardContainerType = cardContainer.classList[1];

    mouseDown && handleDrag(event.pageX, cardContainerType);

    if (cardContainerType === 'action-movies') {
        mouseMoveLastXPositionActionMovies = event.pageX;
    } else {
        mouseMoveLastXPositionTvShows = event.pageX;
    }
};

const handleGestureUp = () => mouseDown = false;

const handleDrag = (eventPageX = 0, cardContainerType) => {
    let mouseMoveDifference = 0;

    // When eventPageX is provided it means that the dragging action is being handled.
    // Otherwise, the window resize position reset is being handled.
    if (eventPageX) {
        if (cardContainerType === 'action-movies') {
            mouseMoveDifference = eventPageX - mouseDownLastPositionXActionMovies;
        } else {
            mouseMoveDifference = eventPageX - mouseDownLastPositionXTvShows;
        }
    }

    let translateValueX;

    if (cardContainerType === 'action-movies') {
        translateValueX = mouseMoveDifference + actionMoviesContainerTransformX;
    } else {
        translateValueX = mouseMoveDifference + tvShowsContainerTransformX;
    }

    // Don't allow to drag out ouf left side bounds.
    const hasDraggedOutOfLeftSideBounds = translateValueX > 0;
    if (hasDraggedOutOfLeftSideBounds) {
        translateValueX = 0;
    }

    // Don't allow to drag out ouf right side bounds.
    let rightSideFurthestCoordinates;

    if (cardContainerType === 'action-movies') {
        rightSideFurthestCoordinates = actionMovieContainer.offsetWidth - window.innerWidth;
    } else {
        rightSideFurthestCoordinates = tvShowContainer.offsetWidth - window.innerWidth;
    }

    // Total card container side margin values.
    const container = cardContainerType === 'action-movies' ? actionMovieContainer : tvShowContainer;
    const cardContainerSideMargin = parseInt(window.getComputedStyle(container).getPropertyValue('margin')) * 2;

    const hasDraggedOutOfRightSideBounds = Math.abs(translateValueX) > rightSideFurthestCoordinates + cardContainerSideMargin;
    if (hasDraggedOutOfRightSideBounds) {
        // The value when dragging left is negative, so it needs to be converted negative here as well.
        translateValueX = -(rightSideFurthestCoordinates + cardContainerSideMargin);
    }

    if (cardContainerType === 'action-movies') {
        actionMovieContainer.style.transform = `translateX(${translateValueX}px)`;
    } else {
        tvShowContainer.style.transform = `translateX(${translateValueX}px)`;
    }
};

const isMobile = window.matchMedia('(pointer: coarse)').matches;
if (isMobile) {
    actionMovieContainer.addEventListener('pointerdown', (event) => handleGestureDown(event, actionMovieContainer));
    actionMovieContainer.addEventListener('pointermove', (event) => handleGestureMove(event, actionMovieContainer));
    actionMovieContainer.addEventListener('pointerup', handleGestureUp);
    actionMovieContainer.addEventListener('pointerleave', handleGestureUp);

    tvShowContainer.addEventListener('pointerdown', (event) => handleGestureDown(event, tvShowContainer));
    tvShowContainer.addEventListener('pointermove', (event) => handleGestureMove(event, tvShowContainer));
    tvShowContainer.addEventListener('pointerup', handleGestureUp);
    tvShowContainer.addEventListener('pointerleave', handleGestureUp);
} else {
    actionMovieContainer.addEventListener('mousedown', (event) => handleGestureDown(event, actionMovieContainer));
    actionMovieContainer.addEventListener('mousemove', (event) => handleGestureMove(event, actionMovieContainer));
    actionMovieContainer.addEventListener('mouseup', handleGestureUp);
    actionMovieContainer.addEventListener('mouseleave', handleGestureUp);

    tvShowContainer.addEventListener('mousedown', (event) => handleGestureDown(event, tvShowContainer));
    tvShowContainer.addEventListener('mousemove', (event) => handleGestureMove(event, tvShowContainer));
    tvShowContainer.addEventListener('mouseup', handleGestureUp);
    tvShowContainer.addEventListener('mouseleave', handleGestureUp);
}

