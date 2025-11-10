import databaseClient from "../../infrastructure/config/database/databaseClient";
import { FIND_ALL_VIDEOS_QUERY, SAVE_VIDEO_QUERY } from "../../infrastructure/config/database/queries/videoQueries";
import logger from "../../utils/logger";
import { VideoEntity } from "../entity/VideosEntity";
import { VideoRepositoryInterface } from "./interfaces/VideoRepositoryInterface";

class VideoRepository implements VideoRepositoryInterface {

    findById(id: number): Promise<VideoEntity | null> {
        throw new Error("Method not implemented.");
    }

    async findAll(): Promise<VideoEntity[]> {
        try {
            const result = await databaseClient.query<VideoEntity>(
                FIND_ALL_VIDEOS_QUERY,
            );

            logger.debug('Videos retrieved: ' + JSON.stringify(result.rows));
            const savedVideo = result.rows;

            return savedVideo;
        } catch (error: Error | any) {
            logger.error('Error to get all videos: ' + error.message);
            throw new Error("Errro al obtener los videos");
        }
    }

    async save(entity: VideoEntity): Promise<number> {
        try {
            const result = await databaseClient.query<{ id: number, title: string }>(
                SAVE_VIDEO_QUERY,
                [
                    entity.producer_id,
                    entity.title,
                    entity.description || null,
                    entity.url,
                    entity.duration || null,
                    entity.category || null,
                    entity.created_by,
                    entity.last_update_by || null,
                ]
            );

            const savedVideo = result.rows[0];

            return savedVideo?.id!;
        } catch (error: Error | any) {
            logger.error('Error saving video: ' + error.message);
            throw new Error("Error al guardar el video");
        }
    }

    update(entity: VideoEntity): Promise<void> {
        throw new Error("Method not implemented.");
    }

    delete(id: number): Promise<void> {
        throw new Error("Method not implemented.");
    }

}

export default VideoRepository;