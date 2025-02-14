/* istanbul ignore file */
import "source-map-support/register";
import { container } from "@biorate/inversion";
import { Root } from "./config";

container.get(Root).$run();
