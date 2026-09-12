/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { BlockSvg } from '../block_svg.js';
import { IDragStrategy } from '../interfaces/i_draggable.js';
import { Coordinate } from '../utils/coordinate.js';
export declare class DuplicateOnDrag implements IDragStrategy {
    private block;
    private baseStrat;
    private copy;
    constructor(block: BlockSvg);
    isMovable(): boolean;
    startDrag(e?: PointerEvent): void;
    drag(newLoc: Coordinate, e?: PointerEvent): void;
    endDrag(e?: PointerEvent): void;
    revertDrag(): void;
}
//# sourceMappingURL=duplicate_on_drag_strategy.d.ts.map