const cardContainer = document.querySelector('.card-container');
const cards = document.querySelectorAll('.card');

cards.forEach(card => {
    card.addEventListener('focus', (event) => {
        const isFocusedWithKeyboard = event.target.matches(':focus-visible');
        isFocusedWithKeyboard && card.scrollIntoView({ inline: 'center', behavior: 'smooth' });
    });
});

window.addEventListener('resize', () => {
    handleDrag();
});

let mouseDown = false;
let mouseDownLastPositionX = 0;
let cardContainerTransformX = 0;
let mouseMoveLastXPosition = 0;

const handleMouseDown = (event) => {
    cardContainer.style.cursor = 'grab';

    mouseDown = true;
    mouseDownLastPositionX = event.pageX;

    const cardContainerTransform = window.getComputedStyle(cardContainer).getPropertyValue('transform');

    if (cardContainerTransform !== 'none') {
        cardContainerTransformX = cardContainerTransform.split(',')[4].trim();
        cardContainerTransformX = parseInt(cardContainerTransformX);
    }
};

const handleMouseMove = (event) => {
    mouseDown && handleDrag(event.pageX);
    mouseMoveLastXPosition = event.pageX;
};

const handleMouseUp = () => {
    cardContainer.style.cursor = 'pointer';
    mouseDown = false;
};

const handleDrag = (eventPageX = 0) => {
    let mouseMoveDifference = mouseDownLastPositionX;

    // When eventPageX is set that menus that the
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
}


if (window.PointerEvent) {
    cardContainer.addEventListener('pointerdown', handleMouseDown);
    cardContainer.addEventListener('pointermove', handleMouseMove);
    cardContainer.addEventListener('pointerup', handleMouseUp);
    cardContainer.addEventListener('pointerleave', handleMouseUp);
} else {
    cardContainer.addEventListener('mousedown', handleMouseDown);
    cardContainer.addEventListener('mousemove', handleMouseMove);
    cardContainer.addEventListener('mouseup', handleMouseUp);
    cardContainer.addEventListener('mouseleave', handleMouseUp);
}

