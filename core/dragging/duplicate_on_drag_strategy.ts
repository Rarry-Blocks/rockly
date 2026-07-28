/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {BlockSvg} from '../block_svg.js';
import {BlockDragStrategy} from './block_drag_strategy.js';
import {IDragStrategy} from '../interfaces/i_draggable.js';
import * as clipboard from '../clipboard.js';
import {Coordinate} from '../utils/coordinate.js';

export class DuplicateOnDrag implements IDragStrategy {
  private block: BlockSvg;
  private baseStrat: IDragStrategy;
  private copy: BlockSvg | null = null;

  constructor(block: BlockSvg) {
    this.block = block;
    this.baseStrat = new BlockDragStrategy(block);
  }

  isMovable(): boolean {
    return true;
  }

  startDrag(e?: PointerEvent): void {
    if (!this.block.isShadow()) {
      this.baseStrat = new BlockDragStrategy(this.block);
      this.block.setDragStrategy(this.baseStrat);
      this.block.getDragStrategy().startDrag(e);
      return;
    }

    const ws = this.block.workspace;
    const data = this.block.toCopyData();

    if (this.block.saveExtraState)
      (data as any).blockState.extraState = this.block.saveExtraState();

    this.copy = clipboard.paste(data as any, ws) as BlockSvg;
    if (this.copy) {
      this.copy.setShadow(false);
    }

    this.baseStrat = new BlockDragStrategy(this.copy!);
    this.copy!.setDragStrategy(this.baseStrat);
    this.copy!.getDragStrategy().startDrag(e);
  }

  drag(newLoc: Coordinate, e?: PointerEvent): void {
    if (!this.copy) {
      this.baseStrat?.drag(newLoc, e);
      return;
    }
    const gesture = this.block.workspace.getGesture(e!);
    (gesture?.getCurrentDragger() as any)?.setDraggable(this.copy);
    this.baseStrat.drag(newLoc, e);
  }

  endDrag(e?: PointerEvent): void {
    this.baseStrat?.endDrag(e);
  }

  revertDrag(): void {
    if (!this.copy) {
      this.baseStrat?.revertDrag();
      return;
    }
    this.copy?.dispose();
  }
}
