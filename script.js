const actionMovieContainer = document.querySelector('.card-container.action-movies');
const tvShowContainer = document.querySelector('.card-container.tv-shows');

document.addEventListener('DOMContentLoaded', () => {
    if (window.PointerEvent) {
        actionMovieContainer.addEventListener('pointerdown', handleGestureDown);
        actionMovieContainer.addEventListener('pointermove', handleGestureMove);
        actionMovieContainer.addEventListener('pointerup', handleGestureUp);
        actionMovieContainer.addEventListener('pointerleave', handleGestureLeave);
    } else {
        actionMovieContainer.addEventListener('mousedown', handleGestureDown);
        actionMovieContainer.addEventListener('mousemove', handleGestureMove);
        actionMovieContainer.addEventListener('mouseup', handleGestureUp);
        actionMovieContainer.addEventListener('mouseleave', handleGestureLeave);
    }
});

let mouseDown = false;

let mouseDownLastPositionXActionMovies = 0;
let actionMoviesContainerTransformX = 0;
let mouseMoveLastXPositionActionMovies = 0;

window.addEventListener('resize', () => handleDrag());

const handleGestureDown = (event) => {
    mouseDown = true;
    mouseDownLastPositionXActionMovies = event.pageX;

    const cardContainerTransform = window.getComputedStyle(actionMovieContainer).getPropertyValue('transform');

    if (cardContainerTransform !== 'none') {
        actionMoviesContainerTransformX = cardContainerTransform.split(',')[4].trim();
        actionMoviesContainerTransformX = parseInt(actionMoviesContainerTransformX);
    }
};

const handleGestureMove = ({ pageX }) => {
    mouseDown && handleDrag(pageX);
    mouseMoveLastXPositionActionMovies = pageX;
};

const handleGestureUp = () => mouseDown = false;
const handleGestureLeave = () => mouseDown = false;

const handleDrag = (eventPageX = 0) => {
    let mouseMoveDifference = mouseDownLastPositionXActionMovies;

    // When eventPageX is provided it means that the dragging action is being handled.
    // Otherwise, the window resize position reset is being handled.
    if (eventPageX) {
        mouseMoveDifference = eventPageX - mouseDownLastPositionXActionMovies;
    }

    let translateValueX = mouseMoveDifference + actionMoviesContainerTransformX;

    // Don't allow to drag out ouf left side bounds.
    const hasDraggedOutOfLeftSideBounds = translateValueX > 0;
    if (hasDraggedOutOfLeftSideBounds) {
        translateValueX = 0;
    }

    // Don't allow to drag out ouf right side bounds.
    const rightSideFurthestCoordinates = actionMovieContainer.offsetWidth - window.innerWidth;

    // Total card container side margin values.
    const cardContainerSideMargin = parseInt(window.getComputedStyle(actionMovieContainer).getPropertyValue('margin')) * 2;

    const hasDraggedOutOfRightSideBounds = Math.abs(translateValueX) > rightSideFurthestCoordinates + cardContainerSideMargin;
    if (hasDraggedOutOfRightSideBounds) {
        // The value when dragging left is negative, so it needs to be converted negative here as well.
        translateValueX = -(rightSideFurthestCoordinates + cardContainerSideMargin);
    }

    actionMovieContainer.style.transform = `translateX(${translateValueX}px)`;
};

