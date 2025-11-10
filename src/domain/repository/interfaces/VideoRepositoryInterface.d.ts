import { VideoEntity } from "../../entity/VideosEntity";
import { Repository } from "./Repository";

interface VideoRepositoryInterface extends Repository<VideoEntity, number> {
}
