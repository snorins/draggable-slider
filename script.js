const cardContainer = document.querySelector('.card-container');

let mouseDown = false;
let mouseDownLastPositionX = 0;
let cardContainerTransformX = 0;
let mouseMoveLastXPosition = 0;

window.addEventListener('resize', () => handleDrag());

const handleGestureDown = (event) => {
    mouseDown = true;
    mouseDownLastPositionX = event.pageX;

    const cardContainerTransform = window.getComputedStyle(cardContainer).getPropertyValue('transform');

    if (cardContainerTransform !== 'none') {
        cardContainerTransformX = cardContainerTransform.split(',')[4].trim();
        cardContainerTransformX = parseInt(cardContainerTransformX);
    }
};

const handleGestureMove = ({ pageX }) => {
    mouseDown && handleDrag(pageX);
    mouseMoveLastXPosition = pageX;
};

const handleGestureUp = () => mouseDown = false;

const handleGestureLeave = () => mouseDown = false;

const handleDrag = (eventPageX = 0) => {
    let mouseMoveDifference = mouseDownLastPositionX;

    // When eventPageX is provided it means that the dragging action is being handled.
    // Otherwise, the window resize position reset is being handled.
    if (eventPageX) {
        mouseMoveDifference = eventPageX - mouseDownLastPositionX;
    }

    let translateValueX = mouseMoveDifference + cardContainerTransformX;

    // Don't allow to drag out ouf left side bounds.
    const hasDraggedOutOfLeftSideBounds = translateValueX > 0;
    if (hasDraggedOutOfLeftSideBounds) {
        translateValueX = 0;
    }

    // Don't allow to drag out ouf right side bounds.
    const rightSideFurthestCoordinates = cardContainer.offsetWidth - window.innerWidth;

    // Total card container side margin values.
    const cardContainerSideMargin = parseInt(window.getComputedStyle(cardContainer).getPropertyValue('margin')) * 2;

    const hasDraggedOutOfRightSideBounds = Math.abs(translateValueX) > rightSideFurthestCoordinates + cardContainerSideMargin;
    if (hasDraggedOutOfRightSideBounds) {
        // The value when dragging left is negative, so it needs to be converted negative here as well.
        translateValueX = -(rightSideFurthestCoordinates + cardContainerSideMargin);
    }

    cardContainer.style.transform = `translateX(${translateValueX}px)`;
};


if (window.PointerEvent) {
    cardContainer.addEventListener('pointerdown', handleGestureDown);
    cardContainer.addEventListener('pointermove', handleGestureMove);
    cardContainer.addEventListener('pointerup', handleGestureUp);
    cardContainer.addEventListener('pointerleave', handleGestureLeave);
} else {
    cardContainer.addEventListener('mousedown', handleGestureDown);
    cardContainer.addEventListener('mousemove', handleGestureMove);
    cardContainer.addEventListener('mouseup', handleGestureUp);
    cardContainer.addEventListener('mouseleave', handleGestureLeave);
}

